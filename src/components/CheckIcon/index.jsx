import React, { useState, useEffect, Fragment } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const CheckIcon = props => {
  const {
    val
  } = props;

  return (
    <Fragment>
      {
        (val == '1')
          ? (<CheckOutlined style={{ fontSize: '16px', color: '#60CB28' }} />)
          : (<CloseOutlined style={{ fontSize: '16px', color: '#E75757' }} />)

      }
    </Fragment>
  );
};

export default CheckIcon;