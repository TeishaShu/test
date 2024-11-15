import React, { useState, Fragment } from 'react';
import {
  Form,
  Spin,
  Select,
} from 'antd';
import commFn from '@/fn/comm';

const { Option } = Select;

const FormContractAuthorId = props => {
  const {
    isVal,
    setIsVal,
    isList,
    setIsList,
    isName,
    setIsName,
    soldDate,
    setPackTable,
    setContractAuthorPartyB,
    handleRefEdit,
  } = props;

  const [isFetching, setIsFetching] = useState(false);
  let timer;
  const searchOption = (keyword) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/contract_misc/contracts_author_by_code', (res) => {
        let tmpRes = [];

        if (res) {
          res = res.filter((elem) => elem.contract_author && elem.contract_author.is_delete == '0');
          tmpRes = res.map((elem) => ({
            ui_id: `${elem.contract_author.id}_${(elem.subcontract_id) ? (elem.subcontract_id) : ''}`,
            id: elem.contract_author.id,
            contract_code: elem.contract_author.contract_code,
            subcontract_id: elem.subcontract_id,
            subcontract_code: elem.subcontract_code,
            subcontract_parent_author_name: elem.subcontract_parent_author_name,
            subcontract_author_name: elem.subcontract_author_name,
            settle_company_name: (elem.settle_company_name) ? (elem.settle_company_name) : null,
          }));
        }

        setIsList(tmpRes);
        setIsFetching(false);
      }, [{ key: 'release_date', value: soldDate }]);
    }, 200);
  }

  return (
    <Form.Item
      label="藝人發行合約"
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
          setIsName({
            keyword: (option)
              ? (
                (option.subcontractcode)
                  ? (option.subcontractcode)
                  : (
                    (option.contractcode)
                      ? (option.contractcode)
                      : ('')
                  )
              )
              : (''),
            contract_code: (option) ? (option.contractcode) : (''),
            subcontractcode: (option) ? (option.subcontractcode) : (''),
          });

          setContractAuthorPartyB(
            (option)
              ? (
                (option.partybcompany)
                  ? (option.partybcompany)
                  : (
                    (option.partybauthorname)
                      ? (option.partybauthorname)
                      : (
                        (option.partybsubcontractparentauthorname)
                          ? (option.partybsubcontractparentauthorname)
                          : ('')
                      )
                  )
              )
              : ('')
          );
          setPackTable((prev) => {
            let tmpPackTable = { ...prev };
            tmpPackTable.commission_id = '';
            tmpPackTable.ui_split_opt = [];
            return tmpPackTable;
          });
        }}
        onFocus={() => {
          searchOption((isName && isName.keyword) ? (isName.keyword) : (''));
        }}
        onSelect={(value, option) => {
          searchOption(
            (option)
              ? (
                (option.subcontractcode)
                  ? (option.subcontractcode)
                  : (
                    (option.contractcode)
                      ? (option.contractcode)
                      : ('')
                  )
              )
              : ('')
          );
        }}
      >
        {
          (isList)
            ? (
              isList.map(d => (
                <Option
                  key={d.ui_id}
                  contractid={d.id}
                  subcontractid={d.subcontract_id}
                  contractcode={d.contract_code}
                  subcontractcode={d.subcontract_code}
                  partybcompany={d.settle_company_name}
                  partybauthorname={d.subcontract_author_name}
                  partybsubcontractparentauthorname={d.subcontract_parent_author_name}
                  label={(d.subcontract_code) ? (`${d.contract_code} (${d.subcontract_code})`) : (d.contract_code)}
                >
                  {(d.subcontract_code) ? (`${d.contract_code} (${d.subcontract_code})`) : (d.contract_code)}
                </Option>
              ))
            )
            : ([])
        }
      </Select>
    </Form.Item>
  )
}

export default FormContractAuthorId;