import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import axiosInstance from "../services/axiosInstance";
const ProductDetails = (props) => {
  const [product, setProduct] = React.useState({});
  const params = useParams();
  console.log(params);
  React.useEffect(function () {
    if (params.id) {
      axiosInstance
        .get("/api/products/" + params.id)
        .then((res) => {
          setProduct(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [params.id]);
  return (
    <div>
      <h4>
        <Link to={"/products/details/" + product._id}>{product.name}</Link>{" "}
      </h4>
      <p>
        <b>Price: </b>
        {product.price}
      </p>
      <p>{product.description}</p>
      <hr />
    </div>
  );
};

export default ProductDetails;
