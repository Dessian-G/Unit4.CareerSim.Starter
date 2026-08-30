import PropTypes from 'prop-types'
import './Item.css'
import { Link } from 'react-router-dom'

const Item = (props) => {
  return (
    <div className='item'>
      <Link to={`/products/${props.id}`} style={{ textDecoration: 'none' }}><img onClick={() => window.scrollTo(0, 0)} src={props.image} alt="Products" /></Link>
      <p>{props.name}</p>
      <div className="item-prices">
        <div className="item-price">${props.price}</div>
        <div className="item-title">${props.name}</div>
      </div>
    </div>
  )
}

Item.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
}

export default Item
