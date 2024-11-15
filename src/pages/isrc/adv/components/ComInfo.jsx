import copy from 'copy-to-clipboard';
import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Tooltip,
  message,
} from 'antd';
import { CopyOutlined, AudioOutlined, DesktopOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Link, connect } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import BoxIcon from '@/components/BoxIcon';

export const ComInfo = props => {
  const {
    areaCountryText,
    authorizedAreaList,
    authorizedCountryList,
    isrcList: { multiChangeId, optDataType, info },
    isrcTypeList,
    loading,
  } = props;

  return (
    <Fragment>
      <Card
        bordered={false}
        className={`${styles.card} ${styles.titleNoBBd}`}
        title="基本資料"
        loading={loading}
      >
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>
              ISRC：<span>{commFn.strToISRC(info.isrc)}</span>&nbsp;&nbsp;
              {
                (info.isrc)
                  ? (
                    <Tooltip title="複製 ISRC">
                      <CopyOutlined
                        className={styles.om_icon_style}
                        onClick={() => {
                          copy(info.isrc);
                          message.success('複製成功');
                        }}
                      />
                    </Tooltip>
                  )
                  : ('')
              }
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>歌曲名稱：<span>{info.song_name}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              歌曲編號：
              {
                (info.song_id && info.song_code)
                  ? (<Link to={`/song/adv/id/${info.song_id}`} target="_blank">{info.song_code}</Link>)
                  : ('')
              }
            </p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>
              模擬 ISRC：
              <span
                className={
                  (info.belong_isrc_show && info.belong_isrc_show == '1')
                    ? (styles.om_color_red)
                    : (null)
                }
              >{commFn.strToISRC(info.belong_isrc)}</span>
              {
                (info.belong_isrc)
                  ? (
                    <Fragment>
                      <br />
                      <span
                        style={{
                          marginLeft: '80px',
                          display: (info.belong_isrc) ? ('inline') : ('none')
                        }}
                      >
                        {
                          (info.belong_isrc_show && info.belong_isrc_show == '1')
                            ? (<CheckOutlined style={{ fontSize: '16px', color: '#60CB28' }} />)
                            : (<CloseOutlined style={{ fontSize: '16px', color: '#E75757' }} />)
                        }
                        &nbsp;報表以此 ISRC 標示
                      </span>
                    </Fragment>
                  )
                  : ('')
              }
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>錄音版別：<span>{info.version}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>出版型態：<span>{info.isrc_type}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <div className={styles.contentBBd}></div>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>演唱人：<span>{info.singer}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              母帶歸屬：
              <span>{
                (info.tape && info.tape.length > 0)
                  ? (
                    info.tape.map((elem, idx, arr) => elem.company_nickname).join(', ')
                  )
                  : ('')
              }</span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              呈現型式：
              <span>
                {
                  (info.data_type == '1')
                    ? (<AudioOutlined style={{ fontSize: '16px', color: '#60CB28' }} />)
                    : (<DesktopOutlined style={{ fontSize: '16px', color: '#60CB28' }} />)
                }
                &nbsp;&nbsp;
                {
                  (info.data_type)
                    ? (
                      optDataType.filter(elem => elem.value == info.data_type).map(elem2 => elem2.label)
                    )
                    : ('')
                }
              </span>
            </p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>編曲：<span>{info.arranger}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>製作：<span>{info.producer}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>導演：<span>{info.director}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>
              秒數：
              <span>{
                (!isNaN(parseInt(info.length)))
                  ? (`${parseInt(info.length / 60)}'${parseInt(info.length) % 60}"`)
                  : ('')
              }
              </span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>發行日期：<span>{info.release_date}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>計算歸屬專輯：<span>{info.album_name}{(info.album_release_country) ? (` (${info.album_release_country})`) : ('')}</span></p>
          </Col>
        </Row>
      </Card>
      <Card
        bordered={false}
        className={`${styles.card} ${styles.titleNoBBd}`}
      >
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>新媒體結算 - 錄音：
              <span>
                {
                  (info.is_settle == '1')
                    ? (<CheckOutlined style={{ fontSize: '16px', color: '#60CB28' }} />)
                    : (<CloseOutlined style={{ fontSize: '16px', color: '#E75757' }} />)
                }
              </span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>可上架地區：<span>{areaCountryText}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <div className={styles.contentBBd}></div>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <p>備註：<br />{
              (info.notes)
                ? (
                  info.notes.split('\n').map((elem, idx, arr) => (
                    <span key={idx}>
                      {elem}
                      <br />
                    </span>
                  )))
                : ('')
            }</p>
          </Col>
        </Row>
      </Card>
    </Fragment >
  );
}

export default connect(({ authorizedAreaList, authorizedCountryList, isrcList, isrcTypeList, loading }) => ({
  authorizedAreaList,
  authorizedCountryList,
  isrcList,
  isrcTypeList,
  loading: loading.effects['isrcList/fetchMultiGetISRCInfo'],
}))(ComInfo);