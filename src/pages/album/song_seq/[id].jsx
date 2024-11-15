import React, { useState, useEffect, Fragment } from 'react';
import {
  Form,
  Card,
  Row,
  Col,
  Select,
  Button,
  Modal,
  Popover,
  Spin,
  Result,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import { CloseCircleOutlined } from "@ant-design/icons";
import styles from '@/style/style.less';
import errorStyles from '@/style/error_style.less';
import FooterToolbar from '@/components/FooterToolbar';
import ComInfo from './components/ComInfo';
import FormSongSeq from './components/FormSongSeq';
import FormImportIsrc from './components/FormImportIsrc';
import commFn from '@/fn/comm';

export const song_seq = props => {
  const {
    match,
    loadingMultiGetSongSeq,
    loadingEditSongSeqForm,
    loadingImportIsrc,
    loadingRemoveDisc,
    dispatch,
    albumList: { multiChangeId, optDiscType, info, content, },
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);
  // card show
  const [DiscNum, setDiscNum] = useState(1);
  const [editNoData, setEditNoData] = useState(true);
  // saveObj
  const [saveObj, setSaveObj] = useState({});
  // for Form
  const [songCodeList, setSongCodeList] = useState([]);
  const [isrcList, setIsrcList] = useState([]);
  const [uiIsSettled, setUiIsSettled] = useState([]);

  const getData = () => {
    dispatch({
      type: 'albumList/fetchMultiGetSongSeq',
      payload: {
        album_id: match.params.id,
        disc_id: match.params.disc_id,
      },
    });
  }

  const requestISRC = (song_code) => {
    return new Promise((resolve, reject) => {
      fetch(`${window.FRONTEND_WEB}/song/detail_isrc?song_code=${song_code}`)
        .then(res => res.json())
        .then(jsonData => {
          resolve(jsonData.data && jsonData.data.data_list ? jsonData.data.data_list : []);
        }).catch(err => {
          resolve([]);
        });
    });
  }

  // mount
  useEffect(() => {
    const initObj = {
      song_list: []
    };

    // init object
    form.setFieldsValue({
      ...initObj
    });

    getData();
  }, [match.params.id]);

  // updateData
  useEffect(() => {
    let hasDisc;
    let tmpDisc = [];
    let tmpSaveObj = {
      album_id: match.params.id,
      disc: [],
    };
    let formObj = {
      type: '',
      song_list: []
    };

    setViewLoading(true);

    if (content && content.disc && content.disc.length > 0) {
      for (let i = 0; i < content.disc.length; i++) {
        if (content.disc[i].disc_id == match.params.disc_id) {
          setDiscNum(i + 1);
          formObj.type = content.disc[i].disc_type_id;
          tmpDisc = (content.disc[i].content) ? (content.disc[i].content.slice()) : [];
          hasDisc = true;
          break;
        }
      }

      if (hasDisc && match.params.disc_id) {
        let urls = tmpDisc.map((elem) => (elem.song_code) ? (elem.song_code) : null);
        let requests = urls.map(url => requestISRC(url));
        let tmpSongCodeList = [];
        let tmpUiIsSettled = [];


        // songList, songCodeList
        tmpDisc.forEach((tdElem) => {
          let newFormData = {
            song_seq: tdElem.song_seq,
            song_code: tdElem.song_code,
            song_name: tdElem.song_name,
            isrc: tdElem.isrc,
            singer: tdElem.singer,
            format_length: tdElem.format_length,
            isrc_type: tdElem.isrc_type,
            ui_is_settled: false,
            album_disc_content_id: tdElem.album_disc_content_id,
          };

          if (tdElem.righ_split && tdElem.righ_split.length > 0) {
            for (let j = 0; j < tdElem.righ_split.length; j++) {
              if (tdElem.righ_split[j].is_settled == '1') {
                newFormData.ui_is_settled = true;
                break;
              }
            }
          }

          formObj.song_list.push(newFormData);
          tmpSongCodeList.push([{ id: tdElem.song_id, song_code: tdElem.song_code, song_name: tdElem.song_name }]);
          tmpUiIsSettled.push(newFormData.ui_is_settled);
        });
        form.setFieldsValue({ ...formObj });
        setSongCodeList(tmpSongCodeList);
        setUiIsSettled(tmpUiIsSettled);

        // isrcList
        Promise.all(requests).then(res => {
          let tmpIsrcList = [];
          for (let m = 0; m < res.length; m++) {
            let tmpIsrcOpt = [];
            for (let n = 0; n < res[m].length; n++) {
              let tmpIsrcItem = {
                ...res[m][n],
                label: res[m][n].isrc,
                value: res[m][n].isrc
              }
              tmpIsrcOpt.push(tmpIsrcItem);
            }
            tmpIsrcList.push(tmpIsrcOpt);
          }
          setIsrcList(tmpIsrcList);

          setViewLoading(false);
          setEditNoData(false);
        });
      } else {
        setViewLoading(false);
        setEditNoData(true);
      }
    } else {
      setViewLoading(false);
      setEditNoData(true);
    }

    // chcek disc
    if (!hasDisc) {
      if (content && content.disc) {
        setDiscNum(content.disc.length + 1);
      } else {
        setDiscNum(1);
      }
    }

    // setSaveObj
    if (content.disc) {
      for (let j = 0; j < content.disc.length; j++) {
        let discItem = {
          disc_id: '',
          disc_seq: '',
          type: '',
          content: []
        };

        discItem.disc_id = content.disc[j].disc_id;
        discItem.disc_seq = content.disc[j].disc_seq;
        discItem.type = content.disc[j].disc_type_id;
        for (let k = 0; k < content.disc[j].content.length; k++) {
          let songItem = {
            song_seq: content.disc[j].content[k].song_seq,
            isrc: content.disc[j].content[k].isrc,
          };

          discItem.content.push(songItem);
        }

        tmpSaveObj.disc.push(discItem);
      }
    }

    setSaveObj(tmpSaveObj);
  }, [multiChangeId]);


  // confirm
  const showConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要取消修改嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        history.push(`/album/adv/${match.params.id}`);
      },
      onCancel() { },
    });
  }

  // removeData
  const showRemoveConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要刪除嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        if (uiIsSettled.filter((elem) => (elem)).length > 0) {
          commFn.errHandler('有歌曲已結算，不可刪除');
        } else {
          removeData();
        }
      },
      onCancel() { },
    });
  }
  const removeData = () => {
    dispatch({
      type: 'albumList/fetchRemoveDisc',
      payload: {
        disc_id: match.params.disc_id,
      },
      callback: res => {
        if (res && res != 'error') {
          history.push(`/album/adv/${match.params.id}`);
        }
      }
    });
  }

  // valid behavior -----
  // fieldLabels
  const fieldLabels = {
    // album_code: '專輯編號',
  };

  // valid
  const getErrorInfo = errors => {
    const errorCount = errors.filter(item => item.errors.length > 0).length;
    // fix Form.List field
    const cusFields = [];  // ['song_code'];
    const cusFieldId = '';  // 'song_table';

    if (!errors || errorCount === 0) {
      return null;
    }

    const scrollToField = fieldKey => {
      let labelNode = document.querySelector(`label[for="${fieldKey}"]`);

      if (fieldKey === cusFieldId) {
        labelNode = document.getElementById(cusFieldId);
      }

      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };

    const errorList = errors.map(err => {
      if (!err || err.errors.length === 0) {
        return null;
      }

      let key = err.name[0];
      let renderFieldName = fieldLabels[key];
      let renderSelector = key;

      if (err.name.length > 1) {
        key = '';
        for (let i = 0; i < err.name.length; i++) {
          key += err.name[i];
        }
      }

      if (!renderFieldName) {
        for (let i = 0; i < cusFields.length; i++) {
          if (key.indexOf(cusFields[i]) >= 0) {
            renderFieldName = fieldLabels[cusFieldId][cusFields[i]];
            break;
          }
        }

        renderSelector = cusFieldId;
      }

      return (
        <li key={key} className={errorStyles.errorListItem} onClick={() => scrollToField(renderSelector)}>
          <CloseCircleOutlined className={errorStyles.errorIcon} />
          <div className={errorStyles.errorMessage}>{err.errors[0]}</div>
          <div className={errorStyles.errorField}>{renderFieldName}</div>
        </li>
      );
    });
    return (
      <span className={errorStyles.errorIcon}>
        <Popover
          title="表單驗證訊息"
          content={errorList}
          overlayClassName={errorStyles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode;
            }

            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };
  const onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo);
    setError(errorInfo.errorFields);
  };


  // save
  const onFinish = values => {
    setError([]);

    const setObj = {
      album_id: match.params.id,
      disc_id: null,
      type: values.type,
      content: [],
      change_album_disc_content_id: []
    };
    let newContent = [];
    let tmpChangeAlbumDiscContentId = [];

    function TmpContent(song_seq, isrc, album_disc_content_id) {
      this.song_seq = song_seq;
      this.isrc = isrc;
      if (album_disc_content_id) {
        this.album_disc_content_id = album_disc_content_id;
      }
    }

    if (match.params.disc_id) {
      // disc_id
      for (let i = 0; i < saveObj.disc.length; i++) {
        if (parseInt(saveObj.disc[i].disc_id) == parseInt(match.params.disc_id)) {
          setObj.disc_id = saveObj.disc[i].disc_id;
          break;
        }
      }

      // song_list
      values.song_list.forEach((sElem) => {
        if (!sElem.is_delete || sElem.is_delete == '0') {
          newContent.push(new TmpContent(sElem.song_seq, sElem.isrc, sElem.album_disc_content_id));
        }

        if (sElem.album_disc_content_id && (sElem.is_delete == '1' || sElem.is_edit == '1')) {
          tmpChangeAlbumDiscContentId.push(sElem.album_disc_content_id);
        }
      });

      setObj.content = newContent;
      setObj.change_album_disc_content_id = tmpChangeAlbumDiscContentId;
    } else {
      // disc_id
      delete setObj.disc_id;

      // song_list
      values.song_list.forEach((sElem) => {
        newContent.push(new TmpContent(sElem.song_seq, sElem.isrc, sElem.album_disc_content_id));
      });

      // content
      setObj.content = newContent;
    }

    dispatch({
      type: 'albumList/fetchEditSongSeqForm',
      payload: setObj,
      callback: res => {
        if (res && res != 'error') {
          history.push(`/album/adv/${match.params.id}`);
        }
      }
    });
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loadingMultiGetSongSeq || loadingEditSongSeqForm || loadingImportIsrc || loadingRemoveDisc || viewLoading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <PageHeaderWrapper
          title={`曲序內容 - ${match.params.disc_id ? '修改' : '新增'}`}
          extra={(match.params.disc_id) ? (<Button onClick={showRemoveConfirm}>刪除</Button>) : ('')}
        >
          <ComInfo />
          <Card
            bordered={false}
            className={`${styles.cardBodyNoBPd}`}
          >
            <Row gutter={[8, 0]}>
              <Col xs={24}>
                <span
                  style={{
                    fontWeight: '700',
                    lineHeight: '28px',
                    paddingRight: '15px',
                    fontSize: '16px'
                  }}
                >
                  {`Disc ${DiscNum}`}
                </span>
                <span
                  style={{
                    textAlign: 'left',
                    lineHeight: '28px',
                    fontSize: '14px'
                  }}
                >
                  型態：
                </span>
                <Form.Item
                  name="type"
                  style={{
                    display: 'inline-block',
                    textAlign: 'left',
                    width: '300px'
                  }}
                  rules={[
                    {
                      required: true,
                      message: '此欄位為必填'
                    }
                  ]}
                >
                  <Select
                    style={{ width: 120 }}
                    options={optDiscType}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[8, 0]}>
              <Col xs={24}>
                <div className={styles.contentBBd}></div>
              </Col>
            </Row>
          </Card>
          <Card
            bordered={false}
            className={styles.card}
          >
            {
              (match.params.disc_id && editNoData)
                ? (
                  <Row gutter={[64, 24]}>
                    <Col xs={24}>
                      <Result
                        status="warning"
                        title="查無資料"
                      />
                    </Col>
                  </Row>
                )
                : (
                  <Fragment>
                    <Row gutter={[64, 24]}>
                      <Col xs={24}>
                        <FormSongSeq
                          form={form}
                          songCodeList={songCodeList}
                          setSongCodeList={setSongCodeList}
                          isrcList={isrcList}
                          setIsrcList={setIsrcList}
                          uiIsSettled={uiIsSettled}
                          setUiIsSettled={setUiIsSettled}
                        />
                      </Col>
                    </Row>
                    <Row gutter={[64, 24]}>
                      <Col xs={24}>
                        <FormImportIsrc
                          pageId={match.params.id}
                          discId={match.params.disc_id}
                        />
                      </Col>
                    </Row>
                  </Fragment>
                )
            }
          </Card>
        </PageHeaderWrapper>
        <FooterToolbar>
          {getErrorInfo(error)}
          <Button
            onClick={showConfirm}
          >取消</Button>
          <Button
            type="primary"
            className={styles.submitBtnWidth}
            onClick={() => form?.submit()}
            disabled={(match.params.disc_id && editNoData) ? true : false}
          >送出</Button>
        </FooterToolbar>
      </Form>
    </Spin>
  );
}

export default connect(({ albumList, loading }) => ({
  albumList,
  loadingMultiGetSongSeq: loading.effects['albumList/fetchMultiGetSongSeq'],
  loadingEditSongSeqForm: loading.effects['albumList/fetchEditSongSeqForm'],
  loadingImportIsrc: loading.effects['albumList/fetchImportIsrc'],
  loadingRemoveDisc: loading.effects['albumList/fetchRemoveDisc'],
}))(song_seq);