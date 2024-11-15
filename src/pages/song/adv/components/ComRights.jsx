import React, { Fragment } from 'react';
import {
  Row,
  Col,
  Card,
} from 'antd';
import { Link, connect } from 'umi';
import DetailPanel from './DetailPanel';
import styles from '@/style/style.less';

export const ComRights = props => {
  const {
    text,
    color,
    songList: { detail_rights },
    history,
    showAgencyLists,
    showHistoryAgencyLists,
    songCode,
  } = props;

  // ui -----
  // cover
  const cover = (<div style={{ backgroundColor: color }} />);

  // title
  const title = (
    <Fragment>
      <span className={styles.colorBdCardTitle} style={{ color: color }}>{text}</span>
      {
        (!history)
          ? (<span className={styles.colorBdCardTitle2}>&nbsp;{`共${(detail_rights && detail_rights.rights && detail_rights.rights.rights_num) ? (detail_rights.rights.rights_num) : '0'}筆`}</span>)
          : (<span className={styles.colorBdCardTitle2}>&nbsp;{`共${(detail_rights && detail_rights.history_num) ? (detail_rights.history_num) : '0'}筆`}</span>)
      }
    </Fragment>
  );

  return (
    <Fragment>
      <Card
        bordered={false}
        className={`${styles.colorBdCard} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
        title={title}
        cover={cover}
      >
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <DetailPanel
              history={history}
              rightsList={
                (!history)
                  ? ((detail_rights) ? (detail_rights.rights_list) : ([]))
                  : ((detail_rights) ? (detail_rights.history_list) : ([]))
              }
              agencyList={(!history) ? (showAgencyLists) : (showHistoryAgencyLists)}
              songCode={songCode}
            />
          </Col>
        </Row>
      </Card>
    </Fragment>
  );
}

export default connect(({ songList, loading }) => ({
  songList,
  loadingMultiGetInfo: loading.effects['songList/fetchMultiGetInfo'],
}))(ComRights);