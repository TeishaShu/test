import styles from '@/style/style.less';

const ComPoint = props => {
  const {
    isVal,
    cusColor,  // optional: 'blue', 'green'
  } = props;

  return (
    <p
      className={
        (cusColor)
          ? (
            (cusColor == 'blue')
              ? (styles.om_color_link_blue)
              : (styles.om_color_green)
          )
          : (
            styles.om_color_red
          )
      }
      style={{ fontFamily: 'Arial, Helvetica, sens-serif', textAlign: 'center', fontSize: '28px', lineHeight: '16px' }}
    >
      {
        (isVal && isVal == '1')
          ? ('●')
          : ('○')
      }
    </p>
  );
}

export default ComPoint