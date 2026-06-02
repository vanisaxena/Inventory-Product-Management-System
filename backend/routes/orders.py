from flask import Blueprint, request, jsonify
from models import db, Customer, Product, Order, OrderItem

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    
    if not data or 'customer_id' not in data or 'items' not in data or not isinstance(data['items'], list):
        return jsonify({"error": "Invalid request payload"}), 400

    customer = Customer.query.get(data['customer_id'])
    if not customer:
        return jsonify({"error": "Customer not found"}), 404

    total_amount = 0.0
    order_items_to_create = []

    try:
        for item in data['items']:
            product_id = item.get('product_id')
            quantity = item.get('quantity')

            if not product_id or not quantity or int(quantity) <= 0:
                return jsonify({"error": "Invalid product ID or quantity"}), 400

            product = Product.query.get(product_id)
            if not product:
                return jsonify({"error": f"Product with ID {product_id} not found"}), 404

            if product.quantity_in_stock < int(quantity):
                return jsonify({"error": f"Insufficient stock for product '{product.name}'. Available: {product.quantity_in_stock}"}), 400

            item_total = product.price * int(quantity)
            total_amount += item_total
            product.quantity_in_stock -= int(quantity)

            order_item = OrderItem(product_id=product.id, quantity=int(quantity))
            order_items_to_create.append(order_item)

        new_order = Order(customer_id=customer.id, total_amount=total_amount)
        
        for oi in order_items_to_create:
            new_order.items.append(oi)

        db.session.add(new_order)
        db.session.commit()
        
        return jsonify(new_order.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@orders_bp.route('/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    return jsonify([o.to_dict() for o in orders]), 200

@orders_bp.route('/orders/<int:id>', methods=['GET'])
def get_order(id):
    order = Order.query.get_or_404(id, description="Order not found")
    return jsonify(order.to_dict()), 200

@orders_bp.route('/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    order = Order.query.get_or_404(id)
    try:
        for item in order.items:
            product = Product.query.get(item.product_id)
            if product:
                product.quantity_in_stock += item.quantity

        db.session.delete(order)
        db.session.commit()
        return jsonify({"message": "Order cancelled & deleted successfully, stock restored!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500