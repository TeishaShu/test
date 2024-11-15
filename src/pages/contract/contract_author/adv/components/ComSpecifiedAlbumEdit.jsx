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

export const ComSpecifiedAlbumEdit = props => {
  const {
    isEdit,
    isData,
    onOkForm,
    onCancelForm,
    authorIdList,
    setAuthorIdList,
    albumSelectList,
    setAlbumSelectList,
    pageId,
    onSaveForm,
    dispatch,
    albumList,
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [contractList, setContractList] = useState([]);
  // for author
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  // api -----
  // searchOption (author)
  const searchOption = (keyword, idx) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/album', (res) => {
        let tmpAlbumSelectList = albumSelectList.slice();

        tmpAlbumSelectList[idx] = res;
        setAlbumSelectList(tmpAlbumSelectList);
        setIsFetching(false);
      }, [{ key: 'precise', value: '0' }]);
    }, 200);
  }

  // updateData
  useEffect(() => {
    if (isEdit) {
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
        new_album_ids: [],
        delete_ids: []
      }
    };

    for (let i = 0; i < values.albums.length; i++) {
      let tmpItem = values.albums[i];

      if (tmpItem.id && (tmpItem.is_delete == '1' || tmpItem.is_edit == '1')) {
        saveObj.specified_music.delete_ids.push(tmpItem.id);
      }

      if (!tmpItem.is_delete || tmpItem.is_delete == '0') {
        saveObj.specified_music.new_album_ids.push(tmpItem.album_id);
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
      <Form.List name="albums">
        {(fields, { add, remove }) => {
          let arr = form.getFieldValue().albums;
          let num = 0;

          return (
            <table
              className={styles.formTable}
            >
              <thead>
                <tr>
                  <th>專輯編號</th>
                  <th style={{ width: '400px' }}>專輯名稱</th>
                  <th>發行日期</th>
                  <th>發行地區</th>
                  <th>專輯型態</th>
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
                      key={`albums_${field.key}`}
                      style={(arr[idx] == undefined || arr[idx]['is_delete'] == undefined) ? {} : { display: 'none' }}
                    >
                      <td>
                        <Form.Item shouldUpdate>
                          {() => {
                            let arrOrgList = form.getFieldsValue().albums;
                            return (arrOrgList[idx] && arrOrgList[idx].album_code) ? arrOrgList[idx].album_code : '';
                          }}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item
                          {...field}
                          name={[field.name, 'album_id']}
                          fieldKey={[field.fieldKey, 'album_id']}
                          label=""
                          key={`album_id_${field.fieldKey}`}
                          rules={[
                            {
                              validator(rule, values, callback) {
                                let result = (form.getFieldValue().albums[idx]['is_delete'] == '1') ? (true) : valid.checkRequired(values);

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
                              let arrAddEdit = form.getFieldsValue().albums.slice();

                              // 專輯編號, 專輯名稱, 發行日期, 發行地區, 專輯型態
                              arrAddEdit[idx].album_code = (option) ? (option.ablumcode) : ('');
                              arrAddEdit[idx].album_name_zh = (option) ? (option.label) : ('');
                              arrAddEdit[idx].release_date = (option) ? (option.releasedate) : ('');
                              if (!arrAddEdit[idx].country) {
                                arrAddEdit[idx].country = {};
                              }
                              arrAddEdit[idx].country.country_name_zh = (option) ? (option.releasecountry) : ('');
                              arrAddEdit[idx].type_id = (option) ? (option.typeid) : ('');

                              arrAddEdit[idx]['is_edit'] = '1';
                              form.setFieldsValue({ albums: arrAddEdit });
                            }}
                            onFocus={() => {
                              let tmpAlbumSelectList = albumSelectList.slice();

                              tmpAlbumSelectList[idx] = [];
                              setAlbumSelectList(tmpAlbumSelectList);

                              if (form.getFieldValue()['albums'][idx] && form.getFieldValue()['albums'][idx]['album_name_zh']) {
                                searchOption(form.getFieldValue()['albums'][idx]['album_name_zh'], idx);
                              }
                            }}
                            onSelect={(value, option) => {
                              searchOption(option.label, idx);
                            }}
                          >
                            {
                              (albumSelectList && albumSelectList[idx])
                                ? (
                                  albumSelectList[idx].map(d => (
                                    <Option
                                      key={d.id}
                                      label={d.album_name_zh}
                                      ablumcode={d.album_code}
                                      releasecountry={d.release_country}
                                      releasedate={d.release_date}
                                      typeid={d.type_id}
                                    >
                                      {`${d.album_name_zh} (${d.album_code} | ${d.release_country})`}
                                    </Option>
                                  ))
                                )
                                : ([])
                            }
                          </Select>
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item shouldUpdate>
                          {() => {
                            let arrOrgList = form.getFieldsValue().albums;
                            return (arrOrgList[idx] && arrOrgList[idx].release_date) ? arrOrgList[idx].release_date : '';
                          }}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item shouldUpdate>
                          {() => {
                            let arrOrgList = form.getFieldsValue().albums;
                            return (arrOrgList[idx] && arrOrgList[idx].country && arrOrgList[idx].country.country_name_zh) ? arrOrgList[idx].country.country_name_zh : '';
                          }}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item shouldUpdate>
                          {() => {
                            let arrOrgList = form.getFieldsValue().albums;
                            let tmpTypeData = albumList.optAlbumType.filter((aElem) => (arrOrgList && arrOrgList[idx] && aElem.value == arrOrgList[idx].type_id));

                            return (tmpTypeData.length > 0) ? tmpTypeData[0]['label'] : '';
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
                                let delArr = form.getFieldValue().albums.slice();
                                delArr[idx]['is_delete'] = '1';
                                form.setFieldsValue({ albums: delArr });
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


export default connect(({ albumList, loading }) => ({
  albumList,
}))(ComSpecifiedAlbumEdit);

