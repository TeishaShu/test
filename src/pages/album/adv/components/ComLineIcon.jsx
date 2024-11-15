const ComLineIcon = props => {
  const {
    isChecked
  } = props;
  const cusStyles = {

    height: '36px',
    width: '2px',
    display: 'inline-block',
    marginLeft: '1px',
    marginBottom: '14px'
  };

  return (
    <span
      style={{ ...cusStyles, backgroundColor: (isChecked) ? '#E75757' : '#E5D0D0' }}
    >
      &nbsp;
    </span >
  );
}

export default ComLineIcon;