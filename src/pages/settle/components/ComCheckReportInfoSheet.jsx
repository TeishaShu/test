import styles from '@/style/style.less';

const ComCheckReportInfoSheet = props => {
  const {
    data,
    index,
  } = props;

  const cusStyles = {
    block: {
      display: 'inline-block',
      minWidth: '150px',
      border: '1px solid #ccc',
      margin: '10px 10px 0 0',
    },
    title: {
      borderBottom: '1px solid #ccc',
      minHeight: '20px',
      padding: '5px 10px',
      margin: '0',
      fontWeight: '700',
    },
    desc: {
      minHeight: '30px',
      padding: '5px 10px',
      margin: '0',
      textAlign: 'right',
    },
    greenBgColor: {
      backgroundColor: '#F6FFED',

    },
    greenBorder: {
      borderColor: '#E1F7D1',
    },
    yellowBgColor: {
      backgroundColor: '#FFFBE6',
    },
    yellowBorder: {
      borderColor: '#FFEDB2',
    },
  };

  return (
    <div
      style={
        (index % 2 == 0)
          ? ({ ...cusStyles.block, ...cusStyles.greenBorder })
          : ({ ...cusStyles.block, ...cusStyles.yellowBorder })
      }
    >
      <p
        style={
          (index % 2 == 0)
            ? ({ ...cusStyles.title, ...cusStyles.greenBorder, ...cusStyles.greenBgColor })
            : ({ ...cusStyles.title, ...cusStyles.yellowBorder, ...cusStyles.yellowBgColor })
        }
      >{data.sheet_name}</p>
      <p
        style={cusStyles.desc}
      >
        {(data.sheet_total) && (`$${data.sheet_total}`)}
        <br />
        <span className={styles.om_color_red}>
          {(data.balance_total) && (`$${data.balance_total}`)}
        </span>
      </p>
    </div >
  );
}

export default ComCheckReportInfoSheet;