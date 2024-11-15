import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
} from 'antd';
import { Link, connect } from 'umi';
import styles from '@/style/style.less';
import BoxIcon from '@/components/BoxIcon';

export const ComInfo = props => {
  const {
    areaCountryText,
    albumList: { optAlbumType, info },
  } = props;

  // ui -----
  // boxIconList
  const boxIconList = (
    <Fragment>
      <BoxIcon list={info.is_external} selected="1" text="外部" />
      <BoxIcon list={info.is_debut} selected="1" text="首發" />
    </Fragment>
  );

  return (
    <Fragment>
      <Card
        bordered={false}
        className={styles.card}
        title="基本資料"
        extra={boxIconList}
      >
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>專輯編號：<span>{info.album_code}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>專輯名稱：<span>{info.album_name_zh}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>名稱(英)：<span>{info.album_name_en}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>原始編號：<span>{info.original_code}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>UPC/ENA：<span>{info.upc}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>Project Code：<span>{info.project_code}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>
              Ext Code：
              <span>
                {
                  (info.ext_code && info.ext_code.length > 0)
                    ? (info.ext_code.join(', '))
                    : ('')
                }
              </span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>發行日期：<span>{info.release_date}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <div className={styles.contentBBd}></div>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>演唱人：<span>{info.author}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>發行者：<span>{info.release_nickname}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>使用者：<span>{info.user_nickname}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>發行年限：<span>{(info.release_year && info.release_year != '0') ? (info.release_year) : ''}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>發行到期日：<span>{info.release_expiry_date}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>曲數：<span>{info.song_count}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <div className={styles.contentBBd}></div>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>發行地區：<span>{info.release_country}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>授權地區：<span>{areaCountryText}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>幣別：<span>{info.currency}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>版別：<span>{info.version}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              專輯型態：
              <span>
                {
                  (info.type_id)
                    ? (
                      (optAlbumType.filter((elem) => elem.value == info.type_id).length > 0)
                        ? (optAlbumType.filter((elem) => elem.value == info.type_id)[0]['label'])
                        : ('')
                    )
                    : ('')
                }
              </span>
            </p>
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
              (info.note)
                ? (
                  info.note.split('\n').map((elem, idx, arr) => (
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
    </Fragment>
  );
}

export default connect(({ albumList, loading }) => ({
  albumList,
}))(ComInfo);