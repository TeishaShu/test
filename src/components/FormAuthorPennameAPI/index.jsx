import React, { useState, useEffect, Fragment } from 'react';
import {
  Form,
  Select,
  Spin,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = Select;

const FormAuthorPennameAPI = props => {
  const {
    triggerChangeStatus,
    form,
    isLabel,
    isName,
    isSelectText,
    isList,
    setIsList,
    authorCodeLabel,
    setAuthorCodeLabel,
    isForAuthorName,
  } = props;
  const [selectLoading, setSelectLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  const searchOption = (keyword) => {
    return new Promise((resolve, reject) => {
      setIsFetching(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        commFn.searchOption(keyword, '/author/author_pen', (res) => {
          setIsList(res);
          setIsFetching(false);
          resolve(res);
        });
      }, 200);
    });
  }

  // isForAuthorName change
  useEffect(() => {
    let obj = {}
    let filterList; // for id and author_code
    let filter2List; // for author_code
    let opt = '';

    const clearVal = () => {
      let restObj = {};
      restObj[isName] = '';
      restObj[isSelectText] = '';
      form.setFieldsValue(restObj);
      setAuthorCodeLabel('');
    }

    setIsList([]);

    if (triggerChangeStatus) {
      if (isForAuthorName) {
        setSelectLoading(true);
        searchOption(isForAuthorName).then((res) => {
          if (!res || res.length == 0) {
            clearVal();
          } else {
            opt = form.getFieldValue()[isName];
            filterList = res.filter((elem, idx, arr) => {
              return (opt && opt == elem.id && isForAuthorName == elem.author_code);
            });

            if (filterList.length <= 0) {
              filter2List = res.filter((elem, idx, arr) => {
                return (isForAuthorName == elem.author_code);
              });
              if (filter2List.length > 0) {
                obj[isName] = res[0]['id'];
                obj[isSelectText] = res[0]['pen_name'];
                form.setFieldsValue(obj);
                setAuthorCodeLabel(res[0]['author_code']);
              } else {
                clearVal();
              }
            }
          }
          setSelectLoading(false);
        });
      }
    }
  }, [isForAuthorName]);

  return (
    <Fragment>
      <Form.Item
        label={isLabel}
        name={isName}
      >
        <Select
          loading={selectLoading}
          showSearch
          optionFilterProp="children"
          optionLabelProp="label"
          filterOption={false}
          allowClear={true}
          notFoundContent={isFetching ? <Spin size="small" /> : null}
          onSearch={(value) => {
            searchOption(value);
          }}
          onChange={(value, option) => {
            let obj = {};

            // when click clearIcon, clear 'isList' data
            if (!value) {
              setIsList([]);
            }

            if (option) {
              obj[isSelectText] = option.label;
              form.setFieldsValue(obj);
              setAuthorCodeLabel(option.text);
            } else {
              obj[isSelectText] = '';
              form.setFieldsValue(obj);
              setAuthorCodeLabel('');
            }
          }}
          onFocus={() => {
            setIsList([]);
            searchOption(form.getFieldValue()[isSelectText]);
          }}
          onSelect={(value, option) => {
            searchOption(option.label);
          }}
        >
          {isList.map(d => (
            <Option
              key={d.id}
              label={d.pen_name}
              text={d.author_code}
            >
              {`${d.pen_name} (${d.author_code})`}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <label className={styles.searchLabel}>{(authorCodeLabel) ? `(${authorCodeLabel})` : ''}</label>
    </Fragment >
  );
}

export default FormAuthorPennameAPI;