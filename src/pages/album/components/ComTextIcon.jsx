const ComTextIcon = props => {
  const {
    text,
    isChecked,
    cusColor,
  } = props;
  const cusStyles = {
    typeIcon: {
      fontSize: '12px',
      width: '20px',
      height: '20px',
      display: 'inline-block',
      lineHeight: '18px',
      textAlign: 'center',
      color: '#FFF',
      marginRight: '5px'
    }
  };

  return (
    <span
      style={{
        ...cusStyles.typeIcon,
        backgroundColor:
          (isChecked)
            ? (
              (text == '實')
                ? ('#E75757')
                : (
                  (text == '數')
                    ? ('#40a9ff')
                    : (
                      (cusColor)
                        ? (cusColor)
                        : ('#FFF')
                    )
                )
            )
            : ('#FFF'),
        opacity: (isChecked) ? ('1') : '0'
      }}
    >
      {text}
    </span>
  );
}

export default ComTextIcon;