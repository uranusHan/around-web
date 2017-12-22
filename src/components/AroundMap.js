import React from 'react';
import {POS_KEY} from "../constants";
import {AroundMarker} from "./AroundMarker"

const {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
} = require("react-google-maps");

class AroundMap extends React.Component {
    getMapRef = (map) => {
        this.map = map;
    }
    onDragEnd = () => {
        const center = this.map.getCenter();
        const position = {lat: center.lat(), lon: center.lng()};
        localStorage.setItem(POS_KEY, JSON.stringify(position));
        this.props.loadNearbyPosts();
    }
    render() {
        const pos = JSON.parse(localStorage.getItem(POS_KEY));
        return (
            <GoogleMap
                ref={this.getMapRef}
                onDragEnd={this.onDragEnd}
                defaultZoom={12}
                defaultCenter={{lat: pos.lat, lng: pos.lon}}
            >
            {this.props.posts ? this.props.posts.map(
                (post, index) =>
                    <AroundMarker
                        post={post}
                        position={{lat: post.location.lat, lng: post.location.lon}}
                        key={`${index}-${post.user}-${post.url}`}
                    />) : null}
            </GoogleMap>
        );
    }
}

export const WrappedAroundMap = withScriptjs(withGoogleMap(AroundMap));