from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql

app = Flask(__name__)

CORS(app)

# ================= DATABASE CONNECTION =================

def get_db_connection():

    return pymysql.connect(

        host="gateway01.ap-southeast-1.prod.aws.tidbcloud.com",

        port=4000,

        user="42SwWJic6yNFqqz.root",

        password="h7Z6KKb4enGny0tX",

        database="MahaKaliFoodStore",

        ssl={
            "ssl": {}
        },

        cursorclass=pymysql.cursors.DictCursor

    )

# ================= HOME ROUTE =================

@app.route("/")

def home():

    return "Backend Running Successfully 🚀"

# ================= PLACE ORDER =================

@app.route("/api/place-order", methods=["POST"])

def place_order():

    try:

        data = request.json

        customer_name = data["customer_name"]

        phone = data["phone"]

        address = data["address"]

        items = data["items"]

        amount = data["amount"]

        db = get_db_connection()

        cursor = db.cursor()

        sql = """

        INSERT INTO orders

        (

            customer_name,
            phone,
            address,
            items,
            amount,
            status

        )

        VALUES (%s,%s,%s,%s,%s,%s)

        """

        values = (

            customer_name,
            phone,
            address,
            items,
            amount,
            "pending"

        )

        cursor.execute(sql, values)

        db.commit()

        cursor.close()

        db.close()

        return jsonify({

            "success": True,
            "message": "Order placed successfully"

        })

    except Exception as e:

        print(e)

        return jsonify({

            "success": False,
            "message": "Order failed"

        })

# ================= GET ORDERS =================

@app.route("/api/orders", methods=["GET"])

def get_orders():

    try:

        db = get_db_connection()

        cursor = db.cursor()

        cursor.execute(

            """

            SELECT * FROM orders

            ORDER BY id DESC

            """

        )

        orders = cursor.fetchall()

        cursor.close()

        db.close()

        return jsonify(orders)

    except Exception as e:

        print(e)

        return jsonify([])

# ================= UPDATE STATUS =================

@app.route(

    "/api/update-status/<int:id>",

    methods=["PUT"]

)

def update_status(id):

    try:

        data = request.json

        status = data["status"]

        db = get_db_connection()

        cursor = db.cursor()

        cursor.execute(

            """

            UPDATE orders

            SET status=%s

            WHERE id=%s

            """,

            (status, id)

        )

        db.commit()

        cursor.close()

        db.close()

        return jsonify({

            "success": True

        })

    except Exception as e:

        print(e)

        return jsonify({

            "success": False

        })

# ================= DELETE ORDER =================

@app.route(

    "/api/delete-order/<int:id>",

    methods=["DELETE"]

)

def delete_order(id):

    try:

        db = get_db_connection()

        cursor = db.cursor()

        cursor.execute(

            """

            DELETE FROM orders

            WHERE id=%s

            """,

            (id)

        )

        db.commit()

        cursor.close()

        db.close()

        return jsonify({

            "success": True

        })

    except Exception as e:

        print(e)

        return jsonify({

            "success": False

        })

# ================= RUN SERVER =================

if __name__ == "__main__":

    app.run(

        debug=True,
        host="0.0.0.0",
        port=5000

    )