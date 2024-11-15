import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
} from 'antd';
import { Link, connect } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import ComSplitInfoText from '../../components/ComSplitInfoText';

export const ComSplit = props => {
  const {
    contractAuthorList: { multiChangeId, info },
    contractSongList,
  } = props;
  const [renderSplitList, setRenderSplitList] = useState([]);
  const [splitMaxLength, setSplitMaxLength] = useState(2);

  const tableStyle = {
    grayTagTd: {
      paddingTop: '15px',
      paddingBottom: '0',
      paddingLeft: '0',
      paddingRight: '0'
    },
    grayTagText: {
      padding: '5px',
      backgroundColor: '#D8D8D8',
      marginBottom: '0px',
      textAlign: 'center',
      fontWeight: '700',
      display: 'inline-block',
      width: '100px'
    },
    left2Td: {
      width: '150px',
      borderTop: '1.5px dotted #ECECEC',
      borderBottom: '1.5px dotted #ECECEC',
      borderRight: '1.5px dotted #ECECEC',
    },
    left3Td: {
      width: '150px',
      borderTop: '1.5px dotted #ECECEC',
      borderBottom: '1.5px dotted #ECECEC',
      borderRight: '1.5px dotted #ECECEC',
    },
    rightTd: {
      width: '150px',
      borderTop: '1.5px dotted #ECECEC',
      borderBottom: '1.5px dotted #ECECEC',
    },
  };

  // api -----
  // updateData
  useEffect(() => {
    // spit ---
    let splitList = {
      split_1: [  // CD
        { country_id: '229', country_name: '台灣', convertType: '', convertVal: '', title: 'CD', grayTag: '實體' },
        { country_id: '0', country_name: '其他地區', convertType: '', convertVal: '', },
      ],
      split_2: [  // DVD
        { country_id: '229', country_name: '台灣', convertType: '', convertVal: '', title: 'DVD' },
        { country_id: '0', country_name: '其他地區', convertType: '', convertVal: '', },
      ],
      split_3: [  // 卡帶
        { country_id: '229', country_name: '台灣', convertType: '', convertVal: '', title: '卡帶' },
        { country_id: '0', country_name: '其他地區', convertType: '', convertVal: '', },
      ],
      split_4: [  // 黑膠
        { country_id: '229', country_name: '台灣', convertType: '', convertVal: '', title: '黑膠' },
        { country_id: '0', country_name: '其他地區', convertType: '', convertVal: '', },
      ],
      split_5: [  // Vocal
        { country_id: '229', country_name: '台灣', convertType: '', convertVal: '', title: 'Vocal', grayTag: '數位' },
        { country_id: '0', country_name: '其他地區', convertType: '', convertVal: '', },
      ],
      split_6: [  // Video
        { country_id: '229', country_name: '台灣', convertType: '', convertVal: '', title: 'Video' },
        { country_id: '0', country_name: '其他地區', convertType: '', convertVal: '', },
      ],
      split_7: [  // 營業用單曲
        { country_id: '229', country_name: '台灣', convertType: '', convertVal: '', title: '營業用單曲', grayTag: '商品' },
        { country_id: '0', country_name: '其他地區', convertType: '', convertVal: '', },
      ],
      split_8: [  // 明星商品
        { country_id: '229', country_name: '台灣', convertType: '', convertVal: '', title: '明星商品' },
        { country_id: '0', country_name: '其他地區', convertType: '', convertVal: '', },
      ],
      split_9: [  // 書籍
        { country_id: '229', country_name: '台灣', convertType: '', convertVal: '', title: '書籍' },
        { country_id: '0', country_name: '其他地區', convertType: '', convertVal: '', },
      ],
      split_10: [  // 電子書
        { country_id: '229', country_name: '台灣', convertType: '', convertVal: '', title: '電子書' },
        { country_id: '0', country_name: '其他地區', convertType: '', convertVal: '', },
      ],
      split_11: [  // 其他
        { country_id: '229', country_name: '台灣', convertType: '', convertVal: '', title: '其他', grayTag: 'other' },
        { country_id: '0', country_name: '其他地區', convertType: '', convertVal: '', },
      ],
      split_12: [  // 特殊
        { country_id: '229', country_name: '台灣', convertType: '', convertVal: '', title: '特殊', grayTag: 'other' },
        { country_id: '0', country_name: '其他地區', convertType: '', convertVal: '', },
      ],
    }
    let tmpSplit = (info.split_information) ? (info.split_information.slice()) : [];
    let tmpRenderSplitList = [];

    tmpSplit = tmpSplit.sort(function (a, b) {
      return parseInt((a.country && a.country.id) ? (a.country.id) : '-1') > parseInt((b.country && b.country.id) ? (b.country.id) : '-1') ? 1 : -1;
    }).forEach((elem) => {
      let convertType = '';
      let convertVal = '';

      switch (elem.split_value_type) {
        case '1':  // ?元
          convertType = '';
          convertVal = parseFloat(elem.split_value) + '元';
          break;
        case '2':  // 淨收入?%
          convertType = '淨收入';
          convertVal = parseFloat(elem.split_value) + '%';
          break;
        case '3':  // 銷售65淨收?%
          convertType = '銷售65淨收';
          convertVal = parseFloat(elem.split_value) + '%';
          break;
        case '4':  // 銷售80淨收?%
          convertType = '銷售80淨收';
          convertVal = parseFloat(elem.split_value) + '%';
          break;
        case '5':  // 批發價?%
          convertType = '批發價';
          convertVal = parseFloat(elem.split_value) + '%';
          break;
        case '6':  // 零售價?%
          convertType = '零售價';
          convertVal = parseFloat(elem.split_value) + '%';
          break;
        default:
          convertType = '';
          convertVal = '';
      }

      if (elem.country && elem.country.id == '229') {
        splitList['split_' + elem.contract_author_split_item_id][0]['convertType'] = convertType;
        splitList['split_' + elem.contract_author_split_item_id][0]['convertVal'] = convertVal;
      } else if (elem.is_specified_country == '0') {
        splitList['split_' + elem.contract_author_split_item_id][1]['convertType'] = convertType;
        splitList['split_' + elem.contract_author_split_item_id][1]['convertVal'] = convertVal;
      } else if (elem.country) {
        splitList['split_' + elem.contract_author_split_item_id].push({
          country_id: elem.country.id,
          country_name: elem.country.country_name_zh,
          convertType: convertType,
          convertVal: convertVal
        });
      }
    });

    // setRenderSplitList
    for (let i = 1; i <= 12; i++) {
      tmpRenderSplitList.push(splitList['split_' + i.toString()]);
    }
    setRenderSplitList(tmpRenderSplitList);

    // setSplitMaxLength;
    let tmpMax = 2;
    for (let j = 0; j < tmpRenderSplitList.length; j++) {
      if (tmpMax < tmpRenderSplitList[j].length) {
        tmpMax = tmpRenderSplitList[j].length;
      }
    }
    setSplitMaxLength(tmpMax + 2);
  }, [multiChangeId]);

  return (
    <Card
      bordered={false}
      className={`${styles.card} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
      title="拆分"
    >
      <Row gutter={[8, 0]}>
        <Col xs={24}>
          <ComSplitInfoText />
        </Col>
      </Row>
      <Row gutter={[8, 0]}>
        <Col xs={24}>
          <p style={{ marginTop: '30px' }}>
            幣別：
            <span>
              {
                (info.basic_info && info.basic_info.currency_id)
                  ? (
                    contractSongList.optCurrency.filter((elem) => elem.value == info.basic_info.currency_id)[0]['label']
                  )
                  : ('')
              }
            </span>
          </p>
        </Col>
      </Row>
      <Row gutter={[8, 0]}>
        <Col
          xs={24}
          className={styles.om_overflow_auto}
        >
          <table className={styles.formTable}>
            <tbody>
              {
                renderSplitList.map((elem, idx) => (
                  <Fragment key={`elem_${idx}`}>
                    {
                      (elem[0].grayTag)
                        ? (
                          <tr style={{ display: 'table-row' }}>
                            <td
                              style={tableStyle.grayTagTd}
                              colSpan={splitMaxLength}
                            >
                              {
                                (elem[0].grayTag != 'other')
                                  ? (
                                    <p style={tableStyle.grayTagText}>{elem[0]['grayTag']}</p>
                                  )
                                  : (
                                    <p>&nbsp;</p>
                                  )
                              }
                            </td>
                          </tr>
                        )
                        : (null)
                    }
                    <tr>
                      {
                        elem.map((childElem, childeIdx) => (
                          <Fragment key={`childElem_${childeIdx}`}>
                            {
                              (childeIdx == 0)
                                ? (
                                  <td style={tableStyle.left2Td}>
                                    <p>{childElem['title']}</p>
                                  </td>
                                )
                                : (null)
                            }
                            <td
                              style={
                                (childElem.country_id == '0' || childElem.country_id == '229')
                                  ? (tableStyle.left3Td)
                                  : (tableStyle.rightTd)
                              }
                            >
                              <p>{childElem.country_name}</p>
                              {
                                (childElem.convertType || childElem.convertVal)
                                  ? (<p>{childElem.convertType}<span style={{ color: '#17C617' }}>{childElem.convertVal}</span></p>)
                                  : (<p>&nbsp;</p>)
                              }
                            </td>
                          </Fragment>
                        ))
                      }
                      <td>&nbsp;</td>
                    </tr>
                  </Fragment>
                ))
              }
            </tbody>
          </table>
        </Col>
      </Row>
    </Card>
  );
}

export default connect(({ contractAuthorList, contractSongList, loading }) => ({
  contractAuthorList,
  contractSongList,
  loading: loading.effects['contractAuthorList/fetchGetInfo'],
}))(ComSplit);
