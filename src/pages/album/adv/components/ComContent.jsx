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
import ComContentTable from './ComContentTable';
import ComCopyModal from './ComCopyModal';

export const ComContent = props => {
  const {
    pageId,
    loadingGetContent,
    loadingCopyDisc,
    dispatch,
    albumList: { changeId, content },
  } = props;
  // copyModal
  const [copyModalVisible, setCopyModalVisible] = useState(false);

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

  // copyModal -----
  // showCopyModal
  const showCopyModal = (item) => {
    setCopyModalVisible(true);
  }

  // modal (add or edit) - hide
  const hideCopyModal = () => {
    setCopyModalVisible(false);
  }

  // handleCopyModalSubmit
  const handleCopyModalSubmit = (obj) => {
    let copyObj = { ...obj };

    copyObj.album_id = pageId;
    delete copyObj.album_code;

    dispatch({
      type: 'albumList/fetchCopyDisc',
      payload: copyObj,
      callback: res => {
        if (res && res != 'error') {
          hideCopyModal();
          getData();
        }
      }
    });
  }

  return (
    <Fragment>
      <Card
        bordered={false}
        className={`${styles.card} ${styles.titleNoBBd}`}
        title="專輯內容"
        loading={loadingGetContent || loadingCopyDisc}
        extra={
          <Fragment>
            <Button
              onClick={showCopyModal}
            >複製他張專輯</Button>
            <Button
              type="primary"
              className={styles.om_sp_m_lb}
              onClick={() => {
                history.push(`/album/song_seq/id/${pageId}`);
              }}
            >新增 Disc</Button>
          </Fragment>
        }
      >
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            {
              (content && content.disc && content.disc.length > 0)
                ? (
                  content.disc.map((elem, idx) => (
                    <ComContentTable
                      key={idx}
                      discNum={idx + 1}
                      data={elem}
                      pageId={pageId}
                    // getData={getData}
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
      <ComCopyModal
        visible={copyModalVisible}
        onCancel={hideCopyModal}
        onSubmit={handleCopyModalSubmit}
      />
    </Fragment>
  );
}

export default connect(({ albumList, loading }) => ({
  albumList,
  loadingGetContent: loading.effects['albumList/fetchGetContent'],
  loadingCopyDisc: loading.effects['albumList/fetchCopyDisc'],
}))(ComContent);