import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Input,
  Button,
} from 'antd';
import { connect, history } from 'umi';
import styles from '@/style/style.less';

const { TextArea } = Input;

const FormImportIsrc = props => {
  const {
    dispatch,
    pageId,
    discId,
  } = props;
  const [isrcText, setIsrcText] = useState('');

  // api -----
  // setData
  const setData = () => {
    let outputList = {
      album_id: pageId,
      disc_id: discId,
      isrc_list: [],
    };
    let rowArr = isrcText.split(/\r\n|\n/g);

    // convert data
    if (rowArr && rowArr.length > 0) {
      for (let i = 0; i < rowArr.length; i++) {
        let orgItem = rowArr[i].split(/\t/g);

        if (orgItem[0] && orgItem[0] != '-') {
          outputList.isrc_list.push(orgItem[0]);
        }
      }
    }
    outputList.isrc_list = outputList.isrc_list.join(',');

    dispatch({
      type: 'albumList/fetchImportIsrc',
      payload: outputList,
      callback: (result) => {
        if (result == 'ok') {
          history.push(`/album/adv/${pageId}`);
        }
      },
    });
  }

  // mount
  useEffect(() => {
    setIsrcText('');
  }, [pageId]);

  // ui -----
  const changeText = (e) => {
    setIsrcText(e.target.value);
  }

  return (
    <Row gutter={[12, 24]}>
      <Col
        lg={16}
      >
        <p>匯入 ISRC 清單</p>
        <TextArea
          rows={4}
          value={isrcText}
          onChange={changeText}
        />
      </Col>
      <Col
        xs={8}
        style={{ textAlign: 'relative' }}
      >
        <Button
          className={styles.om_sp_m_lt}
          onClick={setData}
          style={{ position: 'absolute', left: '0', bottom: '0' }}
        >
          匯入
        </Button>
      </Col>
    </Row>
  );
}

export default connect(({ albumList, loading }) => ({
  albumList,
}))(FormImportIsrc);