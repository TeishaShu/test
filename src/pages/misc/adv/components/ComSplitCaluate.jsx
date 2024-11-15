import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
} from 'antd';
import { connect, history } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const ComSplitCaluate = props => {
  const {
    miscList: { multiChangeId, info },
  } = props;
  const [splitCal, setSplitCal] = useState(
    {
      lyrics: {
        flatFee: 0,
        synFee: 0,
        mechFlatFee: 0,
        total: 0,
        tax: 0,
        grossTotal: 0,
      },
      record: {
        amount: 0,
        tax: 0,
        grossTotal: 0,
      }
    }
  );

  useEffect(() => {
    let tmpSplitCal = {
      lyrics: {
        flatFee: 0,
        synFee: 0,
        mechFlatFee: 0,
        total: 0,
        tax: 0,
        grossTotal: 0,
      },
      record: {
        amount: 0,
        tax: 0,
        grossTotal: 0,
      }
    };

    if (info && info.content && info.content.length > 0) {
      for (let i = 0; i < info.content.length; i++) {
        let contentItem = info.content[i];

        if (contentItem) {
          // 詞曲 -----
          if (contentItem.type == '1') {
            tmpSplitCal.lyrics.flatFee = commFn.calAdd(tmpSplitCal.lyrics.flatFee, (!isNaN(parseFloat(contentItem.flat_fee))) ? (parseFloat(contentItem.flat_fee)) : 0);
            tmpSplitCal.lyrics.synFee = commFn.calAdd(tmpSplitCal.lyrics.synFee, (!isNaN(parseFloat(contentItem.syn_fee))) ? (parseFloat(contentItem.syn_fee)) : 0);
            tmpSplitCal.lyrics.mechFlatFee = commFn.calAdd(tmpSplitCal.lyrics.mechFlatFee, (!isNaN(parseFloat(contentItem.mech_flat_fee))) ? (parseFloat(contentItem.mech_flat_fee)) : 0);
          }

          // 錄音 -----
          tmpSplitCal.record.amount = commFn.calAdd(tmpSplitCal.record.amount, (!isNaN(parseFloat(contentItem.amount))) ? (parseFloat(contentItem.amount)) : 0);
        }
      }

      // 詞曲 -----
      tmpSplitCal.lyrics.total = commFn.calAdd(tmpSplitCal.lyrics.flatFee, tmpSplitCal.lyrics.synFee);
      tmpSplitCal.lyrics.total = commFn.calAdd(tmpSplitCal.lyrics.total, tmpSplitCal.lyrics.mechFlatFee);

      tmpSplitCal.lyrics.tax = commFn.calMulti(tmpSplitCal.lyrics.total, (!isNaN(parseFloat(info.tax_rate)) ? (parseFloat(info.tax_rate)) : 0));
      tmpSplitCal.lyrics.tax = commFn.calDiv(tmpSplitCal.lyrics.tax, 100);

      tmpSplitCal.lyrics.grossTotal = commFn.calAdd(tmpSplitCal.lyrics.total, tmpSplitCal.lyrics.tax);

      // 錄音 -----
      tmpSplitCal.record.tax = commFn.calMulti(tmpSplitCal.record.amount, (!isNaN(parseFloat(info.tax_rate)) ? (parseFloat(info.tax_rate)) : 0));
      tmpSplitCal.record.tax = commFn.calDiv(tmpSplitCal.record.tax, 100);

      tmpSplitCal.record.grossTotal = commFn.calAdd(tmpSplitCal.record.amount, tmpSplitCal.record.tax);
    }

    setSplitCal(tmpSplitCal);
  }, [multiChangeId]);

  return (
    <Card
      bordered={false}
      className={styles.card}
      title="拆分總計"
      extra={<p>稅率 {info.tax_rate}%</p>}
    >
      <Row gutter={[64, 24]}>
        <Col xs={24} className={styles.om_overflow_auto}>
          <table className={styles.formTable}>
            <tbody>
              <tr>
                <td className={styles.om_bg_yellow}><p>詞曲</p></td>
                <td className={styles.om_bg_yellow}>
                  <p>Flat Fee</p>
                  <p>$<span>{commFn.numberWithCommas(commFn.trimZero(splitCal.lyrics.flatFee.toFixed(3)))}</span></p>
                </td>
                <td className={styles.om_bg_yellow}>
                  <p>Sync Fee</p>
                  <p>$<span>{commFn.numberWithCommas(commFn.trimZero(splitCal.lyrics.synFee.toFixed(3)))}</span></p>
                </td>
                <td className={styles.om_bg_yellow}>
                  <p>Mech Flat Fee</p>
                  <p>$<span>{commFn.numberWithCommas(commFn.trimZero(splitCal.lyrics.mechFlatFee.toFixed(3)))}</span></p>
                </td>
                <td className={styles.om_bg_yellow}>
                  <p>Total</p>
                  <p>$<span>{commFn.numberWithCommas(commFn.trimZero(splitCal.lyrics.total.toFixed(3)))}</span></p>
                </td>
                <td className={styles.om_bg_yellow}>
                  <p>Tax</p>
                  <p>$<span>{commFn.numberWithCommas(splitCal.lyrics.tax.toFixed(0))}</span></p>
                </td>
                <td className={styles.om_bg_yellow}>
                  <p>Gross Total</p>
                  <p className={styles.om_color_red}>$<span>{commFn.numberWithCommas(splitCal.lyrics.grossTotal.toFixed(0))}</span></p>
                </td>
              </tr>
              <tr>
                <td className={styles.om_bg_green}><p>錄音</p></td>
                <td className={styles.om_bg_green}>
                  <p>Amount</p>
                  <p>$<span>{commFn.numberWithCommas(commFn.trimZero(splitCal.record.amount.toFixed(3)))}</span></p>
                </td>
                <td className={styles.om_bg_green} colSpan="3"><p>&nbsp;</p></td>
                <td className={styles.om_bg_green}>
                  <p>Tax</p>
                  <p>$<span>{splitCal.record.tax}</span></p>
                </td>
                <td className={styles.om_bg_green}>
                  <p>Gross Total</p>
                  <p className={styles.om_color_red}>$<span>{commFn.numberWithCommas(splitCal.record.grossTotal.toFixed(0))}</span></p>
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
    </Card>
  );
}

export default connect(({ miscList, loading }) => ({
  miscList,
}))(ComSplitCaluate);