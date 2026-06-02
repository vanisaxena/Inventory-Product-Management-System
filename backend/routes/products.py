from flask import Blueprint, request, jsonify
from models import db, Product

products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['POST'])
def create_product():
    data = request.get_json()
    if not data or 'name' not in data or 'sku' not in data or 'price' not in data or 'quantity_in_stock' not in data:
        return jsonify({"error": "Missing required fields"}), 400
    if float(data['price']) < 0 or int(data['quantity_in_stock']) < 0:
        return jsonify({"error": "Price or Quantity cannot be negative"}), 400
    
    existing_product = Product.query.filter_by(sku=data['sku']).first()
    if existing_product:
        return jsonify({"error": "Product with this SKU already exists"}), 400
        
    try:
        new_product = Product(
            name=data['name'], 
            sku=data['sku'], 
            price=float(data['price']), 
            quantity_in_stock=int(data['quantity_in_stock'])
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify(new_product.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@products_bp.route('/products', methods=['GET'])
def get_products():
    return jsonify([p.to_dict() for p in Product.query.all()]), 200

@products_bp.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    return jsonify(Product.query.get_or_404(id).to_dict()), 200

@products_bp.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()
    if 'name' in data: product.name = data['name']
    if 'price' in data:
        if float(data['price']) < 0: return jsonify({"error": "Price cannot be negative"}), 400
        product.price = float(data['price'])
    if 'quantity_in_stock' in data:
        if int(data['quantity_in_stock']) < 0: return jsonify({"error": "Quantity cannot be negative"}), 400
        product.quantity_in_stock = int(data['quantity_in_stock'])
    if 'sku' in data and data['sku'] != product.sku:
        if Product.query.filter_by(sku=data['sku']).first(): return jsonify({"error": "SKU already exists"}), 400
        product.sku = data['sku']
        
    db.session.commit()
    return jsonify(product.to_dict()), 200

@products_bp.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted successfully"}), 200