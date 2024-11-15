import React, { useState, useEffect, Fragment } from 'react';
import globalSettings from '@/fn/globalsettings';
import { RightOutlined, DownOutlined, DollarOutlined, ToolOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
  Spin,
  Tooltip,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link, connect, history } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const ComAlbumList = props => {
  const {
    selectSettlePhaseId,
    enterpriseList: { agent_eid },
    settleAlbumList: { prepaidList },
    albumType,
    dispatch,
    getData,
  } = props;
  const [showList, setShowList] = useState(false);

  // api -----
  // mount
  useEffect(() => {
    if (albumType == 'tw') {
      setShowList(true);
    }
  }, []);

  return (
    <table className={styles.formTable}>
      <thead>
        <tr>
          <th>
            <span
              onClick={() => {
                setShowList(prev => (!prev));
              }}
            >{
                (showList)
                  ? (<DownOutlined />)
                  : (<RightOutlined />)
              }</span>
          </th>
          <th>{
            (albumType == 'tw')
              ? ('專輯編號')
              : ('外部專輯編號')
          }</th>
          <th>發行地區</th>
          <th>發行日期</th>
          <th>表演者</th>
          <th>專輯名稱</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody
        style={{ display: (showList) ? ('table-row-group') : ('none') }}
      >
        {
          (prepaidList && prepaidList[albumType])
            ? (prepaidList[albumType].map((elem, idx) => (
              <tr key={`tr_${[albumType]}_${idx}`}>
                <td><p>&nbsp;</p></td>
                <td><p>{elem.album_code}</p></td>
                <td><p>{elem.release_country}</p></td>
                <td><p>{elem.release_date}</p></td>
                <td><p>{elem.author}</p></td>
                <td><p>{elem.album_name}</p></td>
                <td>{
                  (commFn.convertToBool(elem.count_prepaid))
                  && (<DollarOutlined className={`${styles.om_icon_style} ${styles.om_color_yellow}`} />)
                }</td>
              </tr>
            )))
            : (null)
        }
      </tbody>
    </table>
  );
}

export default connect(({ enterpriseList, settleAlbumList, loading }) => ({
  enterpriseList,
  settleAlbumList,
  // loadingMultiGetSong: loading.effects['songList/fetchMultiGetSong'],
}))(ComAlbumList);