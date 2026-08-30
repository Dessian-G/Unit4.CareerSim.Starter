import PropTypes from 'prop-types'
import './Item.css'
import { Link } from 'react-router-dom'
import { addToCart } from '../utils/cart'

const Item = ({ id, image, name, price }) => {
  return (
    <div className='item'>
      <Link to={`/products/${id}`} className="item-image-link" onClick={() => window.scrollTo(0, 0)}>
        <img src={image} alt={name} />
      </Link>
      <p className="item-name">{name}</p>
      <div className="item-prices">
        <div className="item-price">${Number(price).toFixed(2)}</div>
      </div>
      <button className="item-add-btn" onClick={() => addToCart(id)}>Add to cart</button>
    </div>
  )
}

Item.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export default Item
