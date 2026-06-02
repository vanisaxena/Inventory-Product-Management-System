from flask import Blueprint, request, jsonify
from models import db, Customer

customers_bp = Blueprint('customers', __name__)

@customers_bp.route('/customers', methods=['POST'])
def create_customer():
    data = request.json
    
    if Customer.query.filter_by(email=data.get('email')).first():
        return jsonify({"error": "A customer with this email already exists!"}), 400
        
    if Customer.query.filter_by(phone_number=data.get('phone_number')).first():
        return jsonify({"error": "A customer with this mobile number already exists!"}), 400

    try:
        new_customer = Customer(
            full_name=data['full_name'],
            email=data['email'],
            phone_number=data['phone_number']
        )
        db.session.add(new_customer)
        db.session.commit()
        return jsonify({"message": "Customer registered successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@customers_bp.route('/customers', methods=['GET'])
def get_customers():
    return jsonify([c.to_dict() for c in Customer.query.all()]), 200

@customers_bp.route('/customers/<int:id>', methods=['GET'])
def get_customer(id):
    return jsonify(Customer.query.get_or_404(id).to_dict()), 200

@customers_bp.route('/customers/<int:id>', methods=['DELETE'])
def delete_customer(id):
    customer = Customer.query.get_or_404(id)
    db.session.delete(customer)
    db.session.commit()
    return jsonify({"message": "Customer deleted successfully"}), 200