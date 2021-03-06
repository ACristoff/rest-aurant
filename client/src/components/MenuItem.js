// React
import { Card, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';

// Context API
import { useContext } from 'react';
import { orderContext } from '../providers/OrderProvider';

// View States
const ITEM = 'ITEM';

const MenuItem = ({ item, changeView }) => {

  const { setItem } = useContext(orderContext);

  let [over, setOver] = useState(false);

  // Function that updates the view state and item to focus on.
  const viewDetails = () => {
    setItem(item._id);
    changeView(ITEM);
  };

  const menuItemStyles = {
    padding: '1em',
    'margin-top': '1em',
    display: 'flex',
    'flex-direction': 'column',
    'align-items': 'center',
    backgroundColor: ''
  }

  const secondaryStyles = {
    width: '100%',
    display: 'flex',
    'flex-direction':'row',
    'justify-content' : 'space-between'
  }

  const tertiaryStyles = {
    width: '55%'
  }

  const typeoStyles = {
    'text-align':'right'
  }

  if (over) {
    menuItemStyles.backgroundColor = "Gainsboro";
  }
  else {
    menuItemStyles.backgroundColor = '';
  }

  return (
    <div>
      <Paper sx={{ width: 90 + '%' }} elevation={4} style={menuItemStyles} onMouseOver={() => setOver(true)} onMouseOut={() => setOver(false)} onClick={() => viewDetails()}>
        <div style={secondaryStyles}>
          <img style={{ width: 100, height: 100 }} src={item.image_url} alt={item.name}></img>
          <div style={tertiaryStyles}>
            <Typography variant="subtitle1" style={typeoStyles}>{item.name}</Typography>
            <Typography style={typeoStyles}>${(item.price).toFixed(2)}</Typography>
          </div>
        </div>
        <Typography>{item.description}</Typography>
      </Paper>
    </div>
  );

};

export default MenuItem;