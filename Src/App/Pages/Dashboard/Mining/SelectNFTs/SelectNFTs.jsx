import React from 'react'
import styled from 'styled-components'
import * as variable from 'Base/Variables'

import { withTranslation } from 'react-i18next';
import PanelNFTs from 'Components/Panel/PanelNFTs';

import { media } from 'Base/Media';
import Transition from 'Components/Transition/Transition';

import Loader from 'Components/Loader/Loader';
import Text from "Components/Typography/Text";

class SelectNFTs extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    /**
     * Select the NFT
     * @param e
     * @param key
     */
    selectNFT = (e, key = null) => {
        this.props.chooseNFT(key);
    };

    /**
     * Check the Image exists
     * @param url
     * @returns {*}
     */
    checkImageExists = (url) => {
        let img;

        try {
            img = require(`../assets/${url}@2x.png`);
        } catch(e) {
            img = require(`../assets/default@2x.png`);
        }

         return img;
    };


    render = () => {
        const { i18n, tokens } = this.props;

        return (
            <Container {...this.props}>
                {Array.isArray(tokens) && tokens.length > 0 ?
                    <React.Fragment>
                        {tokens.map((token, i) => {
                            return (
                                <SectionCol onClick={(e) => this.selectNFT(e, token.table_name) } key={i} >
                                    <Transition delay={i} duration={1}>
                                        <PanelNFTs slug={token.table_name} title={token.contract_name} content="centered" image={this.checkImageExists(token.table_name)} />
                                    </Transition>
                                </SectionCol>
                                )
                        })}
                    </React.Fragment>

                    : Array.isArray(tokens) && tokens.length === 0 ?
                        <NoEntries tag="p" color={variable.white} spacing="large" weight="500" size="large" spacing="smallest">
                            {i18n.t('dashboard.general.noentries')}
                        </NoEntries>
                    :
                    <Loader />
                }

            </Container>
        );
    }
}

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    
    ${media.tablet`
        margin: 0 -${variable.spacingSmall};
    `};
`;

const SectionCol = styled.div`
    width: 100%;
    cursor: pointer;
    margin-bottom: calc(${variable.spacingSmall} * 2);
    transition: all 0.3s ease-in-out;
    
    &:hover {
        transform: scale(1.02);  
        
        img {
            transform: scale(0.9);
        }
    }
    
    ${media.tablet`
        width: 50%;
        padding: 0 ${variable.spacingSmall};
    `};
    
    img {
       transition: all 0.3s ease-in-out; 
    }
`;

const NoEntries = styled(Text)`
    padding-left: ${variable.spacingMedium};
    margin-top: ${variable.spacingLarge};
`;

export default withTranslation()(SelectNFTs);
