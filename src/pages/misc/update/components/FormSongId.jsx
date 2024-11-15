import React, { useState, Fragment } from 'react';
import {
  Form,
  Spin,
  Select,
  Col,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = Select;

const FormSongId = props => {
  const {
    form,
    isVal,
    setIsVal,
    isList,
    setIsList,
    isCode,
    setIsCode,
    isName,
    setIsName,
    idx,
    getRightAndIsrcData,
    handleRefEdit,
  } = props;

  const [isFetching, setIsFetching] = useState(false);
  let timer;
  const searchOption = (keyword) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/song', (res) => {
        let tmpIsList = isList.slice();

        tmpIsList = res;
        setIsList(tmpIsList);
        setIsFetching(false);
      });
    }, 200);
  }

  return (
    <Fragment>
      <Col xs={24} lg={8}>
        <Form.Item
          label="歌曲名稱"
          className={styles.addRequiredStar}
        >
          <Select
            showSearch
            optionFilterProp="children"
            optionLabelProp="label"
            filterOption={false}
            allowClear={true}
            notFoundContent={isFetching ? <Spin size="small" /> : null}
            value={isVal}
            onSearch={(value) => {
              searchOption(value);
            }}
            onChange={(value, option) => {
              handleRefEdit();
              setIsVal(value);
              setIsCode(option ? option.text : '');
              setIsName(option ? option.label : '');
              getRightAndIsrcData('songCode', option ? option.text : '');
            }}
            onFocus={() => {
              searchOption(isName);
            }}
            onSelect={(value, option) => {
              searchOption(option.label);
            }}
          >
            {
              (isList)
                ? (
                  isList.map(d => (
                    <Option
                      key={d.id}
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
      </Col>
      <Col xs={24} lg={8}>
        <Form.Item
          label="歌曲編號"
        >
          <label>{isCode}</label>
        </Form.Item>
      </Col>
    </Fragment>
  )
}

export default FormSongId;