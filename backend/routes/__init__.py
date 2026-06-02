from .dashboard import dashboard_bp
from .products import products_bp
from .customers import customers_bp
from .orders import orders_bp

def register_blueprints(app):
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(customers_bp)
    app.register_blueprint(orders_bp)