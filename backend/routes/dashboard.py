from flask import Blueprint, jsonify
from models import Product, Customer, Order

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard/summary', methods=['GET'])
def get_dashboard_summary():
    total_products = Product.query.count()
    total_customers = Customer.query.count()
    total_orders = Order.query.count()
    
    low_stock_products = Product.query.filter(Product.quantity_in_stock < 10).all()
    
    return jsonify({
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "low_stock_products": [p.to_dict() for p in low_stock_products]
    }), 200

@dashboard_bp.route('/stats', methods=['GET'])
def get_stats():
    try:
        total_products = Product.query.count()
        total_orders = Order.query.count()
        low_stock = Product.query.filter(Product.quantity_in_stock <= 5).count()
        
        return jsonify({
            "total_products": total_products,
            "low_stock": low_stock,
            "total_orders": total_orders
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500