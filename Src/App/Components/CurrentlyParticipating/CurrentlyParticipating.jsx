
import React from 'react'
import styled from 'styled-components'
import * as variable from 'Base/Variables'
import { media } from 'Base/Media';
import {inject, observer} from "mobx-react";
import Transition from "Components/Transition/Transition";
import {withTranslation} from "react-i18next";

/**
 *  Main Panel class for the NFTs
 *  Pass in multiple prop types to display on screen
 *  title, image, hashrate, selectButton
 */

@inject('AuthStore', 'MiningStore')
@observer
class CurrentlyParticipating extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ago: null,
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.checkIfParticipating();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    checkIfParticipating = () => {
        const { MiningStore, AuthStore } = this.props;

        MiningStore.get(AuthStore.token).then((res) => {
            this.setState({ checkParticipating: true });
            if(res.next_window && res.ago && res.hr && res.participating) {
                this.setState({ nextWindow: res.next_window, ago: res.ago, hashrate: res.hr, participating: true });
            }
        });
    };

    render = () => {
        const { ago, checkParticipating, participating } = this.state;
        const { i18n } = this.props;

        return (
            checkParticipating && participating ?
                <Transition duration={1}>
                        <Container {...this.props}>
                            {i18n.t('dashboard.participation.submitted')} {ago}
                        </Container>
                </Transition>

                : null
        );
    }
}


const Container = styled.div`
    font-family: ${variable.bodyFontFamily};
    text-decoration: none;
    width: 100%;
    display: table;
    text-align: center;
    color: ${variable.light};
    font-size: ${variable.textMedium};
    padding: ${variable.spacingSmallest};
    border-top: 1px solid ${variable.green};
    background-color: rgba(0,0,0,0.9);
    width: 20vw;
    display: table;
    text-align: center;
    padding: 0.2rem;
    cursor: pointer;
    position: fixed;
    bottom:0;
    left: 0;
    display: none;
    
    ${media.tablet`
        padding: ${variable.spacingSmall};
        display: block;
        font-size: ${variable.textSmall};
    `} 
`;

const Memoize = React.memo(CurrentlyParticipating);
export default withTranslation()(Memoize);

