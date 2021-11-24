// React
import React, { useEffect } from 'react';

// Context API
import { useContext } from 'react';
import { orderContext } from '../providers/OrderProvider';
import { viewContext } from '../providers/ViewProvider';

// Redux
import { useSelector } from 'react-redux';

// Components
import MenuItem from './MenuItem';

// View States
const CART = 'CART';

const Menu = () => {

  const params = new URLSearchParams(window.location.search);
  const table = params.get('table');

  const { state, setItem, setTable } = useContext(orderContext);
  const { changeView } = useContext(viewContext);

  useEffect(() => {
    setTable(parseInt(table));
  }, []);


  // Retrieve all records of the Item model
  // that is in the items store.
  const items = useSelector((state) => state.items);

  // Generate array of MenuItem components.
  //
  // Look at the properties passed to a MenuItem component:
  //
  // key - Needed since each child in a list should have a unique "key" prop.
  //       In our case, we use the _id property generated by MongoDB.
  //
  // item - An Item record with the structure
  //        {
  //          _id: '619b0ae6f5d42f8e3d159cc0',
  //          name: 'Pad Thai Carbonara',
  //          price: 14.99,
  //          description: 'Seductively creamy & nutty.',
  //          category: 'Food'
  //          options: ['Exclude - Peanuts', 'Exclude - Tomato'],
  //          tags: ['noodle', 'signature', 'carbonara', 'pad thai']
  //        }
  //
  // changeView - Function that adds a new view (e.g., "ITEM") into the view state defined in App.js,
  //              which then renders the corresponding component.
  //
  // setItem - Function that helps the application know which Item record is in focus.
  const generateMenuItems = () => (
    items.map((item) => (
      <MenuItem key={item._id} item={item} changeView={changeView} setItem={setItem} />
    ))
  );

  return (
    <div>
      <div>
        {!items.length ? "Loading..." : generateMenuItems()}
      </div>
      <br />
      <div>
        {state.order.length > 0 && <button onClick={() => changeView(CART)}>CART</button>}
      </div>
    </div>
  );

};

export default Menu;