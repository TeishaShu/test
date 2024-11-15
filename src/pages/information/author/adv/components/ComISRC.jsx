
import React, { useState, useEffect, Fragment } from 'react';
import { PlusOutlined, AudioOutlined, DesktopOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
  Pagination,
  Table,
  Tooltip,
} from 'antd';
import { Link, connect } from 'umi';
import globalSettings from '@/fn/globalsettings';
import PageHint from '@/components/PageHint';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const ComISRC = props => {
  const {
    loading,
    dispatch,
    pageId,  // is author_id
    isrcList: { changeId, isrcByAuthor },
  } = props;
  const pageSize = globalSettings.pageSize;
  const [pageCurrent, setPageCurrent] = useState(1);

  // api -----
  // getData
  const getData = (obj) => {
    dispatch({
      type: 'isrcList/fetchGetIsrcByAuthor',
      payload: {
        author_id: pageId,
        page_current: (obj && obj.pageCurrent) ? obj.pageCurrent.toString() : pageCurrent.toString(),
        page_size: pageSize,
      },
    });
  }

  // updateData
  useEffect(() => {
    setPageCurrent(1);
    getData({
      pageCurrent: 1,
    });
  }, [pageId]);

  // ui -----
  // page
  const changePage = (page) => {
    let nowPage = parseInt(page);
    setPageCurrent(nowPage);
    getData({ pageCurrent: nowPage });
  }

  // table columns
  const columns = [
    {
      title: 'I.S.R.C',
      dataIndex: 'isrc',
      key: 'isrc',
      render: (text, row, index) => {
        let renderText = commFn.strToISRC(text);

        return (<Link to={`/isrc/adv/${row.id}`}>{renderText}</Link>);
      },
    },
    {
      title: '',
      dataIndex: 'data_type',
      key: 'data_type',
      render: (text, row, index) => {
        if (text == '1') {
          return (<Tooltip title="Vocal"><AudioOutlined className={styles.om_icon_style} /></Tooltip>);
        } else {
          return (<Tooltip title="Video"><DesktopOutlined className={styles.om_icon_style} /></Tooltip>);
        }
      },
    },
    {
      title: '歌名',
      dataIndex: 'song_name',
      key: 'song_name',
    },
    {
      title: '歌曲編號',
      dataIndex: 'song_code',
      key: 'song_code',
      render: (text, row, index) => {
        return (<Link to={`/song/adv/song_code/${row.song_code}`} target="_blank">{text}</Link>);
      },
    },
    {
      title: '演唱人',
      dataIndex: 'singer',
      key: 'singer',
    },
    {
      title: '出版型態',
      dataIndex: 'isrc_type',
      key: 'isrc_type',
    },
    {
      title: '出版日期',
      dataIndex: 'release_date',
      key: 'release_date',
      sorter: true,
      defaultSortOrder: undefined,  // ascend, descend
    },
    {
      title: '錄音版別',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '母帶權利',
      dataIndex: 'tape',
      key: 'tape',
      render: (text, row, index) => {
        let renHtml = [];

        if (text) {
          for (let i = 0; i < text.length; i++) {
            if (i == text.length - 1) {
              renHtml.push(<span key={`tape_${index}_${i}`}>{text[i]}</span>);
            } else {
              renHtml.push(<span key={`tape_${index}_${i}`}>{text[i]}< br /></span>);
            }
          }
        }

        return renHtml;
      }
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (text, row, index) => {
        return (
          (row.split_num && parseInt(row.split_num) > 0)
            ? (<Tooltip title="有分拆"><CheckCircleOutlined className={`${styles.om_icon_style} ${styles.om_color_green}`} /></Tooltip>)
            : (<Tooltip title="無分拆"><CloseCircleOutlined className={`${styles.om_icon_style} ${styles.om_color_red}`} /></Tooltip>)
        );
      },
    },
  ];

  return (
    <Fragment>
      <Card bordered={false}>
        <Row>
          <Col xs={24}>
            <Pagination
              className={styles.om_sp_m_lb}
              style={{ textAlign: 'right' }}
              current={pageCurrent}
              pageSize={pageSize}
              total={isrcByAuthor.total_items}
              onChange={changePage}
              showSizeChanger={false}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <PageHint
              totalItems={isrcByAuthor.total_items}
              pageSize={pageSize}
              changeId={changeId}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Table
              pagination={false}
              loading={loading}
              columns={columns}
              dataSource={isrcByAuthor.data_list}
              rowKey="id"
            />
          </Col>
        </Row>
      </Card>
    </Fragment>

  );
};

export default connect(({ isrcList, loading }) => ({
  isrcList,
  loading: loading.models.isrcList,
}))(ComISRC);