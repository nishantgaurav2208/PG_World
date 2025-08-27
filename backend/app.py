# backend.py
# =============================================================
# API Backend for a Property Search Web Application
# =============================================================

import pandas as pd
import numpy as np
import os
import sys
from sqlalchemy import create_engine, text
from snowflake.sqlalchemy import URL
import getpass
import re
from flask import Flask, request, jsonify
from flask_cors import CORS

try:
    import snowflake.connector
    from snowflake.connector.pandas_tools import write_pandas
except Exception:
    snowflake = None

# --- Flask App Initialization ---
app = Flask(__name__)
CORS(app) 

# --- Step 1: Secure Credentials (using environment variables) ---
SNOWFLAKE_ACCOUNT = os.environ.get("SNOWFLAKE_ACCOUNT", "ARVJMUX-OW09766")
SNOWFLAKE_USER = os.environ.get("SNOWFLAKE_USER", "Devesh290904")
SNOWFLAKE_PASSWORD = os.environ.get("SNOWFLAKE_PASSWORD", "SecurePassword123")
SNOWFLAKE_WAREHOUSE = os.environ.get("SNOWFLAKE_WAREHOUSE", 'HOUSE_RENT')
SNOWFLAKE_DATABASE = os.environ.get("SNOWFLAKE_DATABASE", 'RENTAL_AFFORDABILITY_DB')
SNOWFLAKE_SCHEMA = os.environ.get("SNOWFLAKE_SCHEMA", 'PUBLIC')
SNOWFLAKE_ROLE = os.environ.get("SNOWFLAKE_ROLE", 'ACCOUNTADMIN')

def get_snowflake_engine():
    """Establishes and returns a Snowflake connection engine."""
    try:
        engine = create_engine(URL(
            account=SNOWFLAKE_ACCOUNT,
            user=SNOWFLAKE_USER,
            password=SNOWFLAKE_PASSWORD,
            warehouse=SNOWFLAKE_WAREHOUSE,
            database=SNOWFLAKE_DATABASE,
            schema=SNOWFLAKE_SCHEMA,
            role=SNOWFLAKE_ROLE
        ))
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ Snowflake connection verified!")
        return engine
    except Exception as e:
        print(f"❌ Snowflake connection failed: {e}")
        return None

# Global variables for data caching
combined_data = pd.DataFrame()

# --- Updated: Load and Prepare Data from the single XLSX file ---
def load_and_prepare_data():
    """Loads and prepares data from the user-provided XLSX."""
    global combined_data
    combined_path = "combined_property_data.xlsx"
    
    if not os.path.exists(combined_path):
        print("❌ Error: Combined data file not found. Please ensure 'combined_property_data.xlsx' is in the same folder.")
        return

    try:
        combined_data = pd.read_excel(combined_path)
        combined_data.columns = combined_data.columns.str.strip()
        print(f"✅ Loaded combined data from {combined_path}")

        if 'Price_range' in combined_data.columns:
            combined_data['PRICE'] = pd.to_numeric(
                combined_data['Price_range'].astype(str).str.extract(r'(\d+)', expand=False), errors='coerce'
            )
            print("✅ Parsed and created 'PRICE' column from 'Price_range'.")
        else:
            print("⚠️ 'Price_range' column not found. Data may not be fully usable.")
            combined_data = pd.DataFrame()

    except Exception as e:
        print(f"❌ Error loading data: {e}")
        combined_data = pd.DataFrame()

load_and_prepare_data()

# --- Step 2: API Endpoints ---

@app.route('/', methods=['GET'])
def home():
    """A simple root route to confirm the API is running."""
    return "<h1>Property Search API is Running!</h1><p>Send a POST request to the /search endpoint.</p>"

@app.route('/search', methods=['POST'])
def search_properties():
    """
    Handles search requests from the frontend.
    Expects a JSON body with 'budget', 'room_type', 'gender', and 'area'.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid JSON or missing data'}), 400

        user_budget = float(data.get('budget', 0))
        user_room_type = data.get('room_type', '')
        user_gender = data.get('gender', '')
        user_area = data.get('area', '')

        engine = get_snowflake_engine()
        results_df = pd.DataFrame()
        
        if engine is None or combined_data.empty or 'PRICE' not in combined_data.columns:
            return jsonify({'error': 'Backend data or connection is not ready.'}), 503

        print("\n⬆️ Forcing a data upload to Snowflake...")
        if 'snowflake' in globals() and snowflake is not None:
            try:
                cnx = snowflake.connector.connect(
                    account=SNOWFLAKE_ACCOUNT,
                    user=SNOWFLAKE_USER,
                    password=SNOWFLAKE_PASSWORD,
                    warehouse=SNOWFLAKE_WAREHOUSE,
                    database=SNOWFLAKE_DATABASE,
                    schema=SNOWFLAKE_SCHEMA,
                    role=SNOWFLAKE_ROLE,
                )
                write_pandas(cnx, combined_data, table_name='COMBINED_PROPERTY_DATA', schema=SNOWFLAKE_SCHEMA, auto_create_table=True, overwrite=True)
                print("✅ Data uploaded successfully.")
            finally:
                if cnx:
                    cnx.close()
        
        print(f"\n🔍 Searching Snowflake for properties with budget: {user_budget}")
        
        query = text(f"""
        SELECT "Property Name", "address", "room_type", "gender", "Source", "PRICE", "Price_range"
        FROM {SNOWFLAKE_SCHEMA}."COMBINED_PROPERTY_DATA"
        WHERE "PRICE" IS NOT NULL
          AND "PRICE" <= :budget
          AND "room_type" ILIKE :room_type
          AND "gender" ILIKE :gender
          AND REGEXP_REPLACE(LOWER("address"), '[^a-z0-9 ]', '') ILIKE :area_norm
        ORDER BY "PRICE" ASC;
        """)

        def _norm(s: str) -> str:
            return re.sub(r'[^a-z0-9 ]', '', s.strip().lower())

        area_norm = f"%{_norm(user_area)}%" if user_area else '%'
        params = {
            'budget': user_budget,
            'room_type': f"%{user_room_type}%" if user_room_type else '%',
            'gender': f"%{user_gender}%" if user_gender else '%',
            'area_norm': area_norm,
        }

        print(f"\n--- DEBUG INFO ---")
        print(f"SQL Query:\n{query}")
        print(f"Parameters:\n{params}")
        print(f"------------------\n")

        with engine.connect() as conn:
            results_df = pd.read_sql_query(query, conn, params=params)
        
        print(f"✅ Found {len(results_df)} results in Snowflake.")

        if not results_df.empty:
            # Drop the numeric price column before returning the JSON response
            if 'PRICE' in results_df.columns:
                results_df = results_df.drop('PRICE', axis=1)
            # Some connectors may lowercase the column name
            if 'price' in results_df.columns:
                results_df = results_df.drop('price', axis=1)
            
            return jsonify(results_df.to_dict(orient='records'))
        else:
            return jsonify([])

    except Exception as e:
        print(f"❌ An error occurred: {e}")
        return jsonify({'error': 'An internal server error occurred.'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)