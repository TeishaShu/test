import React, { useState, useEffect, Fragment } from 'react';
import { CalculatorOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
  Spin,
  Table,
  Tooltip,
} from 'antd';
import { connect } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const ComSongSplit = props => {
  const {
    pageId,
    color,
    dispatch,
    loading,
    loadingCalculateSong,
    albumList: { changeId, songSplit, content },
  } = props;
  const [overCalText, setOverCalText] = useState({});
  const [rightsCalText, setRightsCalText] = useState({});

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'albumList/fetchGetSongSplit',
      payload: {
        album_id: pageId,
      },
      callback: (res) => {
        let tmpOverCalText = { n: 1, d: 1 };
        let hasErr = false;
        let tmpFixedNum = 0;

        if (res && res.album_righ_split_ratio && res.album_righ_split_ratio.length > 0) {
          for (let i = 0; i < res.album_righ_split_ratio.length; i++) {
            let item = res.album_righ_split_ratio[i];

            if (!hasErr) {
              try {
                tmpOverCalText = commFn.fractionCal(tmpOverCalText.n, tmpOverCalText.d, commFn.calMulti(item.numerator, 1000), commFn.calMulti(item.denominator, 1000), 'sub');
              } catch (e) {
                hasErr = true;
                tmpFixedNum = commFn.calSub(commFn.calDiv(tmpOverCalText.n, tmpOverCalText.d), commFn.calDiv(item.numerator, item.denominator));
              }
            } else {
              tmpFixedNum = commFn.calSub(tmpFixedNum, commFn.calDiv(item.numerator, item.denominator));
            }
          }
        }

        if (!hasErr) {
          setOverCalText(tmpOverCalText);
        } else {
          if (tmpFixedNum < 0) {
            setOverCalText({ n: 0, d: 0 });
          } else {
            setOverCalText({ n: commFn.calMulti(parseFloat(tmpFixedNum).toFixed(5), 100), d: 100 });
          }
        }
      }
    });
  }

  // calculateSong
  const calculateSong = () => {
    dispatch({
      type: 'albumList/fetchCalculateSong',
      payload: {
        album_id: pageId
      },
      callback: (res) => {
        getData();
      }
    });
  }

  // mount, update id
  useEffect(() => {
    getData();
  }, [pageId]);

  // update rightsCalText
  useEffect(() => {
    let tmpRightsCalText = { n: 0, d: 0 };

    if (content && content.disc && content.disc.length > 0) {
      for (let i = 0; i < content.disc.length; i++) {
        for (let j = 0; j < content.disc[i].content.length; j++) {
          if (content.disc[i].content[j].is_song_right_calc == '1') {
            for (let k = 0; k < content.disc[i].content[j].righ_split.length; k++) {
              let item = content.disc[i].content[j].righ_split[k];

              tmpRightsCalText.d++;
              if (item.is_default == '1') {
                tmpRightsCalText.n++;
              }
            }
          }
        }
      }
    }

    setRightsCalText(tmpRightsCalText);
  }, [changeId]);

  // ui -----
  // cover
  const cover = (<div style={{ backgroundColor: color }} />);

  const columns = [
    {
      title: '結算對象',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '比例',
      dataIndex: 'fraction',
      key: 'fraction',
    },
    {
      title: '%',
      dataIndex: 'ratio',
      key: 'ratio',
    },
  ];

  return (
    <Spin
      tip="Loading..."
      spinning={loadingCalculateSong || loading}  // TODO
    >
      <Card
        bordered={false}
        className={`${styles.colorBdCard} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
        title={
          <Fragment>
            <span className={styles.colorBdCardTitle} style={{ color: color }}>
              詞曲結算
          </span>
            <span className={styles.colorBdCardTitle2}>
              &nbsp;
              未結：
              {
                (overCalText && ((overCalText.n == 0 && overCalText.d == 0) || (overCalText.n == 0 && overCalText.d == 1)))
                  ? (0)
                  : (
                    <Fragment>
                      {(overCalText && overCalText.d && overCalText.d.toString().indexOf('-') >= 0 ? '-' : '')}
                      {(overCalText && overCalText.n) ? (overCalText.n) : 0}
                      /
                      {(overCalText && overCalText.d) ? (overCalText.d.toString().replace('-', '')) : 0}
                    </Fragment>
                  )
              }
            </span>
            <span className={styles.colorBdCardTitle2}>
              ，應結/我方權利數：
              {
                (rightsCalText)
                  ? (
                    <Fragment>
                      {(rightsCalText.d) ? (rightsCalText.d) : '0'}
                      /
                      {(rightsCalText.n) ? (rightsCalText.n) : '0'}
                    </Fragment>
                  )
                  : ('0/0')
              }
            </span>
          </Fragment>
        }
        cover={cover}
        extra={
          <Tooltip title="計算">
            <CalculatorOutlined
              className={styles.om_icon_style}
              onClick={() => {
                calculateSong();
              }}
            />
          </Tooltip>
        }
      >
        <Table
          pagination={false}
          loading={false}
          columns={columns}
          dataSource={songSplit.album_righ_split_ratio}
          rowKey="album_righ_split_ratio_id"
          summary={(currentData) => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}></Table.Summary.Cell>
              <Table.Summary.Cell index={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={2}><span style={{ fontWeight: '700' }}>{songSplit.total_ratio}</span></Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>
    </Spin>
  );
}

export default connect(({ albumList, loading }) => ({
  albumList,
  loading: loading.effects['albumList/fetchGetSongSplit'],
  loadingCalculateSong: loading.effects['albumList/fetchCalculateSong'],
}))(ComSongSplit);