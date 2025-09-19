import ProductList from "./ProductList";


function Products() {

    return (
        <div className="products">
            <div className="products-container">
                <div className="section-header">
                    <h1 className="products-title">- New Products -</h1>
                </div>
                <ProductList />
            </div>
        </div>
    );
}

export default Products;