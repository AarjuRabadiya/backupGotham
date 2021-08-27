import React from 'react'
import styled, { css } from 'styled-components'
import * as variable from 'Base/Variables'
import gsap from "gsap";


const TransitionWrapper = styled.div`
   width: 100%; 
`;

export default class Transition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultDelay: 10,
        };

        this.element = null;
    }

    componentDidMount() {
        const { duration, delay } = this.props;
        const { defaultDelay } = this.state;

        let delayed = (duration * delay) / defaultDelay;


        gsap.fromTo(this.element, { opacity: 0 }, { delay: delayed, duration: duration, opacity:1, ease:'expo.inOut' });
    }

    render = (props) => {

        return (
            <TransitionWrapper ref={div => this.element = div}>
                {this.props.children}
            </TransitionWrapper>
        );
    }
}
