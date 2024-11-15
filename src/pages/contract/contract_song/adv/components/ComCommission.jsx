import React from 'react';
import {
  Row,
  Col,
  Card,
} from 'antd';
import styles from '@/style/style.less';
import cusStyles from '@/pages/contract/contract_song/styles/index.less';

const ComCommission = props => {
  const {
    info,
  } = props;

  let maxPersentCount = 3;

  info.commission.forEach(e => {
    if (maxPersentCount < e.percentage.length - 2) {
      maxPersentCount = e.percentage.length - 2;
    }
  });

  const getHeader = (data) => {
    const result = data.percentage.map(elem => {
      if (!['TWN', 'OT'].includes(elem.key)) {
        return (<td key={`${data.key}-${elem.key}-title`} className={cusStyles.tdStyle}>{elem.name !== undefined && elem.name}</td>);
      }
      return undefined;
    }).filter(e => e !== undefined);

    for (let i = result.length; i < maxPersentCount; i += 1) {
      result.push(<td key={`nill-${i}-key`} />);
    }
    return result;
  };

  const getBody = (data) => {
    const result = data.percentage.map(elem => {
      if (!['TWN', 'OT'].includes(elem.key)) {
        return (
          <td
            className={`${cusStyles.tdStyle} ${cusStyles.green_font}`}
            key={`${data.key}-${elem.key}-data`}
          >
            {`${parseFloat(elem.value)}%`}
          </td>
        );
      }
      return undefined;
    }).filter(e => e !== undefined);

    for (let i = result.length; i < maxPersentCount; i += 1) {
      result.push(<td key={`nill-${i}-value`} />);
    }
    return result;
  };

  const checkPercentage = (data, type) => {
    let result;
    if (type === 'TWN') {
      const findData = data.percentage.find(e => {
        return e.key === 'TWN';
      });
      result = `${parseFloat(findData ? findData.value : 0)}%`;
    }
    if (type === 'OT') {
      const findData = data.percentage.find(e => {
        return e.key === 'OT';
      });
      result = `${parseFloat(findData ? findData.value : 0)}%`;
    }
    return result;
  };

  return (
    <Card
      bordered={false}
      className={`${styles.colorBdCard} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
      title="扣佣比例"
    >
      <Row gutter={[8, 0]}>
        <Col xs={24}>
          <p style={{ marginTop: '30px' }}>幣別：<span>{info.currency_name}</span></p>
        </Col>
      </Row>
      <Row gutter={[8, 0]}>
        <Col
          xs={24}
          className={styles.om_overflow_auto}
        >
          <table
            key="commission-table"
            style={{ width: '100%', tableLayout: 'fixed' }}
          >
            <tbody key="commission-tbody" className={`${cusStyles.commissionFormTable} ${cusStyles.tr_bottom_line}`}>
              {

                info.commission ? info.commission.map(data => {
                  const result = [];
                  result.push(
                    <tr key={`${data.key}-tr-title`} className={cusStyles.tr_top_line} style={{ width: '100%' }}>
                      <td
                        key={`${data.key}-td-title`}
                        rowSpan="2"
                        className={cusStyles.tdStyle}
                        style={{ height: '91px' }}
                      >
                        {data.name}
                      </td>
                      <td
                        key={`${data.key}-twn-title`}
                        className={cusStyles.tdStyle}
                      >台灣</td>
                      <td
                        key={`${data.key}-ot-title`}
                        className={`${cusStyles.tr_right_dashed} ${cusStyles.tdStyle}`}
                      >其他地區</td>
                      {
                        getHeader(data)
                      }
                    </tr>,
                  );
                  result.push(
                    <tr key={`${data.key}-tr-data`}>
                      <td
                        key={`${data.key}-twn-data`}
                        className={cusStyles.green_font}
                      >
                        {checkPercentage(data, 'TWN')}
                      </td>
                      <td key={`${data.key}-ot-data`}
                        className={`${cusStyles.tr_right_dashed} ${cusStyles.green_font}`}
                      >
                        {checkPercentage(data, 'OT')}
                      </td>
                      {
                        getBody(data)
                      }
                    </tr>,
                  );
                  return result;
                }) : undefined
              }
            </tbody>
          </table>
        </Col>
      </Row>
    </Card>
  );
};

export default ComCommission;
