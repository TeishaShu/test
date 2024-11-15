import {
  Alert,
} from 'antd';
import cusStyles from './index.less';

const ComAlbumPrepaidPageHint = props => {
  const {
    type,
    data,
    noHoldValue,  // optional
  } = props;

  return (
    <div className={cusStyles.hintMargin}>
      <Alert
        message={
          (type == 'not_sell_data')
            ? (
              (noHoldValue)
                ? (`本期無銷售，有預付餘額共 ${data} 筆`)
                : (`本期無銷售，有預付餘額/上期保留量共 ${data} 筆`)
            )
            : (`報表資料共 ${data.origin_row} 筆，有效讀入資料共 ${data.valid_row} 筆，讀入金額：${data.valid_sum}`)
        }
        type={
          (type == 'not_sell_data')
            ? ('info')
            : ('warning')
        }
      />
    </div>
  );
}

export default ComAlbumPrepaidPageHint;