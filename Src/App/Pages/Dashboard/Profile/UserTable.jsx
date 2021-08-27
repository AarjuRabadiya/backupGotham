import React from "react";
import styled from "styled-components";
import { withTranslation } from "react-i18next";
import * as variable from "Base/Variables";
// import { media } from "Base/Media";
import Loader from "Components/Loader/Loader";

class UserTable extends React.PureComponent {
  constructor(props) {
    super();
  }

  render = () => {
    const { data, dataLoading, button } = this.props;

    return (
      <Container>
        {dataLoading ? (
          <Loader />
        ) : data ? (
          <Table>
            <TableRow>
              <TableHeading>Email :-</TableHeading>
              <TableCol>{data.email ? data.email : "-"}</TableCol>
            </TableRow>
            <TableRow>
              <TableHeading>User name :-</TableHeading>
              <TableCol>{data.username ? data.username : "-"}</TableCol>
            </TableRow>
            <TableRow>
              <TableHeading>Facebook id :-</TableHeading>
              <TableCol>{data.facebook_id ? data.facebook_id : "-"}</TableCol>
            </TableRow>
            <TableRow>
              <TableHeading>Google id :-</TableHeading>
              <TableCol>{data.google_id ? data.google_id : "-"}</TableCol>
            </TableRow>
            <TableRow>
              <TableHeading>Meta mask address :-</TableHeading>
              <TableCol>{data.mm_address ? data.mm_address : "-"}</TableCol>
            </TableRow>
            <TableRow>
              <TableHeading>Your boost :-</TableHeading>
              <TableCol>{data.boost ? data.boost : "-"}</TableCol>
            </TableRow>
          </Table>
        ) : null}
      </Container>
    );
  };
}

const Table = styled.div``;

const TableHeading = styled.div`
  font-family: ${variable.bodyFontFamily};
  color: ${variable.white};
  opacity: 1;
  padding: ${variable.spacingSmall};

  text-align: left;
  font-weight: 600;
`;
const TableRow = styled.div`
  display: flex;
  border-bottom: 1px solid ${variable.green};
`;

const TableCol = styled.div`
  font-family: ${variable.bodyFontFamily};
  color: ${variable.white};
  opacity: 1;
  padding: ${variable.spacingSmall};

  text-align: left;
  font-weight: 600;
`;

const Container = styled.div``;

export default withTranslation()(UserTable);
