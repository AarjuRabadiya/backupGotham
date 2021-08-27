import React from 'react';
import styled from 'styled-components';
import * as variable from 'Base/Variables';

import { inject, observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import { media } from 'Base/Media'

import Transition from "Components/Transition/Transition";
import Layout from "Components/Layout/Layout";

import PartnerNFTs from "./PartnerNFTs";
import Loader from "Components/Loader/Loader";


@inject('AuthStore', 'MiningStore')
@observer
class Partners extends React.Component {
    constructor(props) {
        super();
        /**
         *
         * @type {{tokens: null}}
         */
        this.state = {
            tokens: null,
        };
    }

    /**
     * componentDidMount
     * We want to fetch the NFTs via the mining store
     * We recieve the tokens and also check if the user is currently participating
     */
    componentDidMount() {
        const { MiningStore, AuthStore, history } = this.props;

        this.props.loadBg('balance');

        MiningStore.getAvailableNFTs(AuthStore.token).then((res) => {
            if(res.data && res.data.length > 0) {
                this.setState({ nfts: res.data });
            }
        });
    }


    render = () => {
        const { i18n } = this.props;
        const { tokens, nfts } = this.state;


        return (

            <Layout title={i18n.t('dashboard.partners.title')} description={i18n.t('dashboard.partners.description')}>
                {nfts ?
                    <Transition duration={2}>
                        <PartnerNFTs nfts={nfts} tokens={tokens}/>
                    </Transition>
                    :
                    <Loader/>
                }

            </Layout>

        );
    }
}


export default withTranslation()(Partners);
