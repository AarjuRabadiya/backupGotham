import React from 'react';
import styled from 'styled-components';
import * as variable from 'Base/Variables';
import { media } from 'Base/Media'
import { inject, observer } from 'mobx-react';

import { withTranslation } from 'react-i18next';
import Transition from "Components/Transition/Transition";
import Layout from "Components/Layout/Layout";
import TitleTypography from "Components/Typography/Title";
import Text from "Components/Typography/Text";
import Panel from "Components/Panel/Panel";
import Loader from "Components/Loader/Loader";
import BackgroundMix from "Pages/Dashboard/Mining/assets/mixie-bg@2x.jpg";
import Title from "Components/Typography/Title";

const formatDate = (date) => {
    return new Date(Date.parse(date)).toLocaleDateString(
        'en-gb',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZone: 'utc',
        }
    )
};

@inject('AuthStore', 'MiningStore', 'BalanceStore')
@observer
class StatsContainer extends React.Component {
    constructor(props) {
        super();

        this.state = {
            loading: true,
            blocks_mined: 0,
            current_mining_hashrate: 0,
            start_datetime: '',
            end_datetime: '',
            total_eligible_nfts: 0,
            total_nft_submitted: 0,
            total_hashrate_percentage: 0,
            mix_balance: 0,
            bondly_balance: 0,
            cgg_balance: 0,
            cgc_balance: 0,
        }
    }

    /**
     * componentDidMount
     * We want to fetch the NFTs via the mining store
     * We recieve the tokens and also check if the user is currently participating
     */
    componentDidMount() {
        this.props.loadBg('mining');
        this.getStats();
    }

    getStats = (page = 1) => {
        const { MiningStore, AuthStore, BalanceStore } = this.props;
        MiningStore.getMixBalance(AuthStore.token).then((res) => {
            if(res.sum) {
                this.setState({ mix_balance: res.sum })
            }
        })

        BalanceStore.get(AuthStore.token, page).then((res) => {
            this.setState({
                cgc_balance: res.sum
            });
        });

        MiningStore.getBondlyBalance(AuthStore.token).then((res) => {
            if(res.sum) {
                this.setState({ bondly_balance: res.sum })
            }
        })

        MiningStore.getCGGBalance(AuthStore.token).then((res) => {
            if(res.sum) {
                this.setState({ cgg_balance: res.sum })
            }
        })


        MiningStore.getDashboardStats(AuthStore.token, page).then((res) => {
            if(res.data) {
                this.setState({
                    loading: false,
                    blocks_mined: res.data.blocks_mined,
                    current_mining_hashrate: res.data.current_mining_hashrate,
                    start_datetime: res.data.start_datetime,
                    end_datetime: res.data.end_datetime,
                    total_eligible_nfts: res.data.total_eligible_nfts,
                    total_nft_submitted: res.data.total_nft_submitted,
                    total_hashrate_percentage: res.data.total_hashrate_percentage,
                })
            }
        });
    };


    render = () => {
        const { i18n, HistoryStore } = this.props;
        const {
            loading,
            blocks_mined,
            current_mining_hashrate,
            start_datetime,
            end_datetime,
            total_eligible_nfts,
            total_nft_submitted,
            total_hashrate_percentage,
            mix_balance,
            cgg_balance,
            bondly_balance,
            cgc_balance,
        } = this.state;

        return (
            <Layout title={i18n.t('dashboard.stats.title')} description={i18n.t('dashboard.stats.description')}>
                <Transition duration={2}>

                    {total_nft_submitted > 0 ?
                        <Panel theme="purple">
                            <Inner>
                                <StatContent>
                                    <TitleTypography theme="light" shadow={true} tag="h2" align="left" spacing="small" size="smaller" color={variable.greenLight}>
                                        Current Mining Session
                                    </TitleTypography>
                                    <Text textTransform="" tag="p" color={variable.white} align="left" spacing="large" weight="500" size="large" spacing="smaller">
                                        Start Time (UTC):
                                    </Text>
                                    <TitleTypography theme="light" shadow={true} tag="h4" align="left" spacing="small" size="smaller" color={variable.purple}>
                                        {formatDate(start_datetime)}
                                    </TitleTypography>

                                    <Text textTransform="" tag="p" color={variable.white} align="left" spacing="large" weight="500" size="large" spacing="smaller">
                                        End Time (UTC):
                                    </Text>
                                    <TitleTypography theme="light" shadow={true} tag="h4" align="left" spacing="small" size="smaller" color={variable.purple}>
                                        {formatDate(end_datetime)}
                                    </TitleTypography>
                                </StatContent>
                                <StatContent>
                                    <TitleTypography theme="light" shadow={true} tag="h2" align="left" spacing="small" size="smaller" color={variable.greenLight}>
                                        Total NFTs Submitted
                                    </TitleTypography>
                                    <Text textTransform="" tag="p" color={variable.white} align="left" spacing="large" weight="500" size="large" spacing="smaller">
                                        Total NFTs submitted for current session
                                    </Text>
                                    <TitleTypography theme="light" shadow={true} tag="h2" align="left" spacing="small" size="large" color={variable.purple}>
                                        {total_nft_submitted}
                                    </TitleTypography>
                                </StatContent>
                            </Inner>
                        </Panel>

                        : null }


                    {loading === false ?
                        <StatList>


                            <CGG>
                                <CGGContent size="small">
                                    <Title theme="light" shadow={false} tag="h2" align="center" spacing="small" size="small" color={variable.green}>
                                        CGG Rewards
                                    </Title>

                                    <Text tag="div" color={variable.white} spacing="small" align="center" weight="bold" size="small" width="100%">
                                        Your CGG rewards
                                    </Text>

                                    <Title theme="light" shadow={false} tag="h2" align="center" spacing="small" size="large" color={variable.green}>
                                        {cgg_balance > 0 ? cgg_balance.toFixed(2) : 0 }
                                    </Title>
                                </CGGContent>
                            </CGG>

                            <CGC>
                                <CGCContent size="small">
                                    <Title theme="light" shadow={false} tag="h2" align="center" spacing="small" size="small" color="#7F24C7">
                                        CGC Rewards
                                    </Title>

                                    <Text tag="div" color={variable.white} spacing="small" align="center" weight="bold" size="small" width="100%">
                                        Your CGC rewards
                                    </Text>

                                    <Title theme="light" shadow={false} tag="h2" align="center" spacing="small" size="large" color="#D375FF">
                                        {cgc_balance > 0 ? cgc_balance.toFixed(2) : 0 }
                                    </Title>
                                </CGCContent>
                            </CGC>



                            <Bondly>
                                <BondlyContent size="small">
                                    <Title theme="light" shadow={false} tag="h2" align="center" spacing="small" size="small" color="#FFF">
                                        Bondly Rewards
                                    </Title>

                                    <Text tag="div" color={variable.white} spacing="small" align="center" weight="bold" size="small" width="100%">
                                        Your current Bondly rewards
                                    </Text>

                                    <Title theme="light" shadow={false} tag="h2" align="center" spacing="small" size="large" color="#FFF">
                                        {bondly_balance > 0 ? bondly_balance.toFixed(2) : 0 }
                                    </Title>
                                </BondlyContent>
                            </Bondly>

                            <Mixie>
                                <MixContent size="small">
                                    <Title theme="light" shadow={false} tag="h2" align="center" spacing="small" size="small" color="#FAF0AD">
                                        MIX Rewards
                                    </Title>

                                    <Text tag="div" color={variable.white} spacing="small" align="center" weight="bold" size="small" width="100%">
                                        Your current MIX rewards
                                    </Text>

                                    <Title theme="light" shadow={false} tag="h2" align="center" spacing="small" size="large" color="#FAF0AD">
                                        {mix_balance > 0 ? mix_balance.toFixed(2) : 0 }
                                    </Title>
                                </MixContent>
                            </Mixie>


                            <Stat>
                                <TitleTypography theme="light" shadow={true} tag="h2" align="center" spacing="small" size="smaller" color={variable.greenLight}>
                                    Current Mining Hashrate
                                </TitleTypography>
                                <Text textTransform="" tag="p" color={variable.white} align="center" spacing="large" weight="500" size="large" spacing="smaller">
                                    Hashrate total for current session
                                </Text>
                                <TitleTypography theme="light" shadow={true} tag="h2" align="center" spacing="small" size="large" color={variable.purple}>
                                    {current_mining_hashrate}
                                </TitleTypography>
                            </Stat>
                            <Stat>
                                <TitleTypography theme="light" shadow={true} tag="h2" align="center" spacing="small" size="smaller" color={variable.greenLight}>
                                    Current Mining Percentage
                                </TitleTypography>
                                <Text textTransform="" tag="p" color={variable.white} align="center" spacing="large" weight="500" size="large" spacing="smaller">
                                    Hashrate % of total for current session
                                </Text>
                                <TitleTypography theme="light" shadow={true} tag="h2" align="center" spacing="small" size="large" color={variable.purple}>
                                    {total_hashrate_percentage > 0 ? total_hashrate_percentage?.toFixed(2) : 0}%
                                </TitleTypography>
                            </Stat>


                            <Stat>
                                <TitleTypography theme="light" shadow={true} tag="h2" align="center" spacing="small" size="smaller" color={variable.greenLight}>
                                    Total Eligible NFTs
                                </TitleTypography>
                                <Text textTransform="" tag="p" color={variable.white} align="center" spacing="large" weight="500" size="large" spacing="smaller">
                                    Your total NFT count
                                </Text>
                                <TitleTypography theme="light" shadow={true} tag="h2" align="center" spacing="small" size="large" color={variable.purple}>
                                    {total_eligible_nfts}
                                </TitleTypography>
                            </Stat>

                            <Stat>
                                <TitleTypography theme="light" shadow={true} tag="h2" align="center" spacing="small" size="smaller" color={variable.greenLight}>
                                    Block Participation
                                </TitleTypography>
                                <Text textTransform="" tag="p" color={variable.white} align="center" spacing="large" weight="500" size="large" spacing="smaller">
                                    Total block participation for current session
                                </Text>
                                <TitleTypography theme="light" shadow={true} tag="h2" align="center" spacing="small" size="large" color={variable.purple}>
                                    {blocks_mined}
                                </TitleTypography>
                            </Stat>
                        </StatList>
                        : <Loader /> }
                </Transition>


            </Layout>
        );
    }
}

const MixContent = styled.div`
    padding: 4rem;
    width: 100%;
`

const Mixie = styled.div`
    border: 2px solid orange;
    width: 100%;
    color: #fff;
    justify-content: space-between;
    background: url(${BackgroundMix}) no-repeat;
    background-size: cover;
    
    ${media.desktop`
        display: flex;
    `}
`


const CGGContent = styled.div`
    padding: 4rem;
    width: 100%;
`

const CGG = styled.div`
    border: 2px solid ${variable.green};
    width: 100%;
    color: #fff;
    justify-content: space-between;
    background-size: cover;
    
    ${media.desktop`
        display: flex;
    `}
`


const CGCContent = styled.div`
    padding: 4rem;
    width: 100%;
`

const CGC = styled.div`
    border: 2px solid #7F24C7;
    width: 100%;
    color: #fff;
    justify-content: space-between;
    background-size: cover;
    background-color: rgb(9 0 16 / 80%);
    
    ${media.desktop`
        display: flex;
    `}
`

const BondlyContent = styled.div`
    padding: 4rem;
    width: 100%;
`

const Bondly = styled.div`
    border: 2px solid #2547C9;
    background-color: rgb(37 71 201 / 10%);
    width: 100%;
    color: #fff;
    justify-content: space-between;
    background-size: cover;
    
    ${media.desktop`
        display: flex;
    `}
`

const Inner = styled.div`
    display: grid;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    padding: 2rem 4rem 2rem 2rem;
`;

const StatList = styled.div`
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    margin-bottom: 20px;
    margin-top: 20px;
    
    ${media.desktop`
       grid-template-columns: repeat(2, 1fr);
    `}
    
     ${props => props.type === 'large' ? `
        grid-template-columns: repeat(1, 1fr);
    ` : `
        text-align: center;
        gap: 20px;
    `}
`;

const Stat = styled.div`
    width: 100%;
    padding: 4rem;
    background: #0D0414;
    border: 1px solid #7F24C7;
    
    ${props => props.type === 'row' ? `
        display: flex;
        justify-content: space-around;
    `: null}
`;

const StatContent = styled.div`

`;

export default withTranslation()(StatsContainer);
