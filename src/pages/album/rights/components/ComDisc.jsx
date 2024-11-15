import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Result,
  Button,
} from 'antd';
import { Link, connect, history } from 'umi';
import styles from '@/style/style.less';
import ComDiscTable from './ComDiscTable';

export const ComContent = props => {
  const {
    pageId,
    loadingGetContent,
    dispatch,
    albumList: { changeId, content },
  } = props;

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'albumList/fetchGetContent',
      payload: {
        album_id: pageId,
      },
    });
  }

  // mount
  useEffect(() => {
    getData();
  }, [pageId]);


  return (
    <Fragment>
      <Card
        bordered={false}
        className={`${styles.card} ${styles.titleNoBBd}  ${styles.cardTopSpace}`}
        title="專輯內容"
        loading={loadingGetContent}
      >
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            {
              (content && content.disc && content.disc.length > 0)
                ? (
                  content.disc.map((elem, idx) => (
                    <ComDiscTable
                      key={`ComDiscTable_${idx}`}
                      isIdx={idx}
                      discNum={idx + 1}
                      data={elem}
                    />
                  ))
                )
                : (
                  <Result
                    status="warning"
                    title="查無資料"
                  />
                )
            }
          </Col>
        </Row>
      </Card>
    </Fragment>
  );
}

export default connect(({ albumList, loading }) => ({
  albumList,
  loadingGetContent: loading.effects['albumList/fetchGetContent'],
}))(ComContent);