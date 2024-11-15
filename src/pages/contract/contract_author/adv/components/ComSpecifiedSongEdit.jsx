import React, { useState, useEffect, Fragment } from 'react';
import {
  Form,
  Select,
  Button,
  Modal,
  Spin,
} from 'antd';
import { connect } from 'umi';
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import valid from '@/fn/valid';

const { Option } = Select;

export const ComSpecifiedSongEdit = props => {
  const {
    isEdit,
    setViewLoading,
    isData,
    onOkForm,
    onCancelForm,
    authorIdList,
    setAuthorIdList,
    albumSelectList,
    setAlbumSelectList,
    songSelectList,
    setSongSelectList,
    pageId,
    onSaveForm,
    dispatch,
    isrcTypeList,
    albumList,
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [contractList, setContractList] = useState([]);
  const [isrcSelectList, setIsrcSelectList] = useState([]);
  // for author
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  // api -----
  // searchOption (song)
  const searchOption = (keyword, idx) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/song', (res) => {
        let tmpSongSelectList = songSelectList.slice();

        tmpSongSelectList[idx] = res;
        setSongSelectList(tmpSongSelectList);
        setIsFetching(false);
      });
    }, 200);
  }

  // searchIsrcOption
  const searchIsrcOption = (keyword, idx) => {
    if (keyword) {
      fetch(`${window.FRONTEND_WEB}/song/detail_isrc?song_code=${keyword}`).then(
        res => res.json()
      ).then(opts => {
        let arrSongList = form.getFieldsValue().songs;
        let tmpIsrcList = isrcSelectList.slice();

        if (opts.data && opts.data.data_list && opts.data.data_list.length > 0) {
          tmpIsrcList[idx] = opts.data.data_list.map((elem) => ({ ...elem, value: elem.id, label: elem.isrc }));
          arrSongList[idx].isrc = opts.data.data_list[0].isrc;
          arrSongList[idx].isrc_id = opts.data.data_list[0].id;
          arrSongList[idx].singer = opts.data.data_list[0].singer;
          arrSongList[idx].isrc_type_id = opts.data.data_list[0].isrc_type_id;
        } else {
          tmpIsrcList[idx] = [];
          arrSongList[idx].isrc = '';
          arrSongList[idx].isrc_id = '';
          arrSongList[idx].singer = '';
          arrSongList[idx].isrc_type_id = '';
        }

        setIsrcSelectList(tmpIsrcList);
        form.setFieldsValue({ songs: arrSongList });
      }).catch(err => {
        let arrSongList = form.getFieldsValue().songs;
        let tmpIsrcList = isrcSelectList.slice();

        tmpIsrcList[idx] = [];
        setIsrcSelectList(tmpIsrcList);
        arrSongList[idx].isrc = '';
        arrSongList[idx].isrc_id = '';
        arrSongList[idx].singer = '';
        arrSongList[idx].isrc_type_id = '';
        form.setFieldsValue({ songs: arrSongList });
      });
    } else {
      let arrSongList = form.getFieldsValue().songs;
      let tmpIsrcList = isrcSelectList.slice();

      tmpIsrcList[idx] = [];
      setIsrcSelectList(tmpIsrcList);
      arrSongList[idx].isrc = '';
      arrSongList[idx].isrc_id = '';
      arrSongList[idx].singer = '';
      arrSongList[idx].isrc_type_id = '';
      form.setFieldsValue({ songs: arrSongList });
    }
  }

  // requestISRC
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

  // updateData
  useEffect(() => {
    if (isEdit) {
      setViewLoading(true);

      if (isData.songs && isData.songs.length > 0) {
        let urls = isData.songs.map((elem) => (elem.song_code) ? (elem.song_code) : null);
        let requests = urls.map(url => requestISRC(url));

        // isrcList, setSaveObj
        Promise.all(requests).then(res => {
          let tmpIsrcSelectList = [];
          for (let m = 0; m < res.length; m++) {
            let tmpIsrcOpt = [];

            for (let n = 0; n < res[m].length; n++) {
              let tmpIsrcItem = {
                ...res[m][n],
                label: res[m][n].isrc,
                value: res[m][n].id
              }
              tmpIsrcOpt.push(tmpIsrcItem);
            }

            tmpIsrcSelectList.push(tmpIsrcOpt);
          }

          setIsrcSelectList(tmpIsrcSelectList);
          setViewLoading(false);
        });
      } else {
        setIsrcSelectList([]);
        setViewLoading(false);
      }

      form.setFieldsValue({
        ...isData,
      });
    }
  }, [isEdit]);

  const onFinish = values => {
    setError([]);

    let saveObj = {
      contract_author_id: pageId,
      specified_music: {
        new_isrc_ids: [],
        delete_ids: []
      }
    };

    for (let i = 0; i < values.songs.length; i++) {
      let tmpItem = values.songs[i];

      if (tmpItem.id && (tmpItem.is_delete == '1' || tmpItem.is_edit == '1')) {
        saveObj.specified_music.delete_ids.push(tmpItem.id);
      }

      if (!tmpItem.is_delete || tmpItem.is_delete == '0') {
        saveObj.specified_music.new_isrc_ids.push(tmpItem.isrc_id);
      }
    }

    onSaveForm(saveObj);
  }

  const onFinishFailed = errorInfo => {
    setError(errorInfo.errorFields);
  }

  // ui -----
  // confirm
  const showConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要取消修改嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        onCancelForm();
      },
      onCancel() { },
    });
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.List name="songs">
        {(fields, { add, remove }) => {
          let arr = form.getFieldValue().songs;
          let num = 0;

          return (
            <table
              className={styles.formTable}
            >
              <thead>
                <tr>
                  <th>歌曲編號</th>
                  <th style={{ width: '300px' }}>歌曲名稱</th>
                  <th style={{ width: '200px' }}>ISRC</th>
                  <th>演唱人</th>
                  <th>型態</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, idx) => {
                  if (arr[idx] == undefined || arr[idx]['is_delete'] == undefined) {
                    num++;
                  }

                  return (
                    <tr
                      key={`songs_${field.key}`}
                      style={(arr[idx] == undefined || arr[idx]['is_delete'] == undefined) ? {} : { display: 'none' }}
                    >
                      <td>
                        <Form.Item shouldUpdate>
                          {() => {
                            let arrOrgList = form.getFieldsValue().songs;
                            return (arrOrgList[idx] && arrOrgList[idx].song_code) ? arrOrgList[idx].song_code : '';
                          }}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item
                          {...field}
                          name={[field.name, 'song_code']}
                          fieldKey={[field.fieldKey, 'song_code']}
                          label=""
                          key={`song_code_${field.fieldKey}`}
                          rules={[
                            {
                              validator(rule, values, callback) {
                                let result = (form.getFieldValue().songs[idx]['is_delete'] == '1') ? (true) : valid.checkRequired(values);

                                if (result != false) {
                                  callback();
                                } else {
                                  callback(valid.checkRequired_msg);
                                }
                              }
                            }
                          ]}
                        >
                          <Select
                            showSearch
                            optionFilterProp="children"
                            optionLabelProp="label"
                            filterOption={false}
                            allowClear={true}
                            notFoundContent={isFetching ? <Spin size="small" /> : null}
                            onSearch={(value) => {
                              searchOption(value, idx);
                            }}
                            onChange={(value, option) => {
                              let arrAddEdit = form.getFieldsValue().songs.slice();
                              let tmpSongSelectList = songSelectList.slice();

                              // 歌曲編號, 歌曲名稱, isrc, 演唱人, 型態
                              if (!value) {
                                arrAddEdit[idx]['song_name'] = '';
                                arrAddEdit[idx]['isrc_id'] = '';
                                arrAddEdit[idx]['isrc'] = '';
                                arrAddEdit[idx]['singer'] = '';
                                arrAddEdit[idx]['isrc_type_id'] = '';

                                tmpSongSelectList[idx] = [];
                                setSongSelectList(tmpSongSelectList);
                                searchIsrcOption('', idx);
                              } else {
                                searchIsrcOption(arrAddEdit[idx].song_code, idx);
                              }

                              arrAddEdit[idx]['is_edit'] = '1';

                              form.setFieldsValue({ songs: arrAddEdit });
                            }}
                            onFocus={() => {
                              let tmpAlbumSelectList = albumSelectList.slice();

                              tmpAlbumSelectList[idx] = [];
                              setAlbumSelectList(tmpAlbumSelectList);

                              if (form.getFieldValue()['songs'][idx] && form.getFieldValue()['songs'][idx]['author_name']) {
                                searchOption(form.getFieldValue()['songs'][idx]['album_name_zh'], idx);
                              }
                            }}
                            onSelect={(value, option) => {
                              searchOption(option.label, idx);
                            }}
                          >
                            {
                              (songSelectList && songSelectList[idx])
                                ? (
                                  songSelectList[idx].map(d => (
                                    <Option
                                      key={d.song_code}
                                      label={d.song_name}
                                      text={d.song_code}
                                      showtext={`${d.song_name} (${d.song_code})`}
                                    >
                                      {`${d.song_name} (${d.song_code})`}
                                    </Option>
                                  ))
                                )
                                : ([])
                            }
                          </Select>
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item
                          {...field}
                          name={[field.name, 'isrc_id']}
                          fieldKey={[field.fieldKey, 'isrc_id']}
                          key={`isrc_id_${field.fieldKey}`}
                          initialValue=""
                          rules={[
                            {
                              validator(rule, values, callback) {
                                let result = (form.getFieldValue().songs[idx]['is_delete'] == '1') ? (true) : valid.checkRequired(values);

                                if (result != false) {
                                  callback();
                                } else {
                                  callback(valid.checkRequired_msg);
                                }
                              }
                            }
                          ]}
                        >
                          <Select
                            style={{ width: '100%' }}
                            onChange={(value, option) => {
                              let arrAddEdit = form.getFieldsValue().songs.slice();

                              // change 'isrc', 'singer', 'isrc_type_id'
                              arrAddEdit[idx].isrc = (option) ? (option.isrc) : ('');
                              arrAddEdit[idx].singer = (option) ? (option.singer) : ('');
                              arrAddEdit[idx].isrc_type_id = (option) ? (option.isrc_type_id) : ('');

                              arrAddEdit[idx]['is_edit'] = '1';
                              form.setFieldsValue({ songs: arrAddEdit });
                            }}
                            options={(isrcSelectList[idx]) ? (isrcSelectList[idx]) : []}
                          />
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item shouldUpdate>
                          {() => {
                            let arrOrgList = form.getFieldsValue().songs;
                            return (arrOrgList[idx] && arrOrgList[idx].singer) ? arrOrgList[idx].singer : '';
                          }}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item shouldUpdate>
                          {() => {
                            let arrOrgList = form.getFieldsValue().songs;
                            let tmpTypeData = isrcTypeList.listAutoList.filter((aElem) => aElem.id == arrOrgList[idx].isrc_type_id);

                            return (tmpTypeData.length > 0) ? tmpTypeData[0]['type'] : arrOrgList[idx].isrc_type_id;
                          }}
                        </Form.Item>
                      </td>
                      <td className={styles.om_td_icon_style}>
                        <Form.Item>
                          <Button
                            type="link"
                            onClick={() => {
                              if (arr[idx] === undefined || arr[idx]['id'] === undefined) {
                                let tmpAlbumSelectList = albumSelectList.slice();
                                tmpAlbumSelectList.splice(idx, 1);
                                setAlbumSelectList(tmpAlbumSelectList);

                                remove(field.name);
                              } else {
                                let delArr = form.getFieldValue().songs.slice();
                                delArr[idx]['is_delete'] = '1';
                                form.setFieldsValue({ songs: delArr });
                              }
                            }}
                          >
                            <CloseOutlined
                              className={`${styles.om_icon_btn_style} ${styles.om_color_red}`}
                            />
                          </Button>
                        </Form.Item>
                      </td>
                    </tr>
                  );
                })}
                <tr
                  className={styles.lastTr}
                >
                  <td colSpan="8">
                    <Button
                      type="dashed"
                      block
                      onClick={() => { add(); }}
                    >
                      <PlusOutlined />新增
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          );
        }}
      </Form.List>
      <Form.Item>
        <div style={{ float: 'right' }}>
          <Button
            className={styles.om_sp_m_lt}
            onClick={showConfirm}
          >取消</Button>
          <Button
            type="primary"
            className={`${styles.submitBtnWidth} ${styles.om_sp_m_lt}`}
            onClick={() => form?.submit()}
          >送出</Button>
        </div>
      </Form.Item>
    </Form>
  );
}


export default connect(({ isrcTypeList, albumList, loading }) => ({
  isrcTypeList,
  albumList,
}))(ComSpecifiedSongEdit);

