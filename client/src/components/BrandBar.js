import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Card } from "react-bootstrap";
import { Context } from "../index";

const BrandBar = observer(() => {
    const { product } = useContext(Context);

    return (
        <div className="d-flex flex-wrap gap-2 mb-3">
            {product.brands.map((brand) => (
                <Card
                    key={brand.id}
                    body
                    style={{ cursor: "pointer", width: "auto" }}
                    className={
                        brand.id === product.selectedBrand.id
                            ? "border-primary"
                            : ""
                    }
                    onClick={() => product.setSelectedBrand(brand)}
                >
                    {brand.name}
                </Card>
            ))}
        </div>
    );
});

export default BrandBar;