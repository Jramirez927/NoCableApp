// Class to hold useful interactions with openlayers funcitonality
import OLMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Icon from 'ol/style/Icon';
import type { Coordinate } from 'ol/coordinate';
import type { JournalEntry } from '../api/journalEntries';
import 'ol/ol.css';

export type { OLMap, VectorSource, Feature };

export interface InitMapOptions {
    /** [lon, lat] in EPSG:4326 geographic coordinates. Defaults to [0, 0]. */
    center?: [number, number];
    /** Initial zoom level. Defaults to 2. */
    zoom?: number;
}

export interface AnimateOptions {
    /** Zoom level to animate to. Defaults to 14. */
    zoom?: number;
    /** Animation duration in milliseconds. Defaults to 800. */
    duration?: number;
}

export class MapUtils {
    /**
     * Converts a [longitude, latitude] pair (EPSG:4326) to an OpenLayers
     * EPSG:3857 coordinate suitable for use with the default OSM map view.
     */
    static toLonLat(lon: number, lat: number): Coordinate {
        return fromLonLat([lon, lat]);
    }

    /**
     * Creates a circular pin Style for rendering journal entry markers.
     * Defaults match the existing pinStyle in storymap/index.tsx.
     */
    static createPinStyle(color = '#e74c3c', radius = 8): Style {
        return new Style({
            image: new CircleStyle({
                radius,
                fill: new Fill({ color }),
                stroke: new Stroke({ color: '#fff', width: 2 }),
            }),
        });
    }

    /**
     * Creates an Icon Style for the search pin marker using the Bootstrap pin-fill SVG.
     */
    static pinSvgDataUrl(color = '#2b09ee', size = 16): string {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 16 16">
  <defs>
    <filter id="pin-shadow" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>
      <feOffset dx="0" dy="1"></feOffset>
      <feComponentTransfer result="offsetblur">
        <feFuncA type="linear" slope="1"></feFuncA>
      </feComponentTransfer>
      <feFlood flood-color="rgba(0,0,0,0.3)"></feFlood>
      <feComposite in2="offsetblur" operator="in"></feComposite>
      <feMerge>
        <feMergeNode></feMergeNode>
        <feMergeNode in="SourceGraphic"></feMergeNode>
      </feMerge>
    </filter>
  </defs>
  <path fill="${color}" filter="url(#pin-shadow)" d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
</svg>`;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    static createPinIconStyle(color = '#2b09ee', scale = 2): Style {
        return new Style({
            image: new Icon({
                src: MapUtils.pinSvgDataUrl(color),
                scale,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
            }),
        });
    }

    /**
     * Creates an Icon Style for journal entry markers using an inline SVG.
     */
    static createEntryStyle(color = '#e74c3c', scale = 1): Style {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="190.914 101.594 19.458 17.942">
  <defs>
    <linearGradient gradientUnits="userSpaceOnUse" x1="200.58" y1="103.572" x2="200.58" y2="118.905" id="gradient-0" gradientTransform="matrix(0.999798, 0.020119, -0.011403, 0.566677, 1.396501, 47.488833)">
      <stop offset="0" style="stop-color: ${color}"></stop>
      <stop offset="1" style="stop-color: color-mix(in srgb, ${color} 65%, black)"></stop>
    </linearGradient>
    <filter id="drop-shadow-filter-1" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur>
      <feOffset dx="0" dy="1"></feOffset>
      <feComponentTransfer result="offsetblur">
        <feFuncA type="linear" slope="1"></feFuncA>
      </feComponentTransfer>
      <feFlood flood-color="rgba(0,0,0,0.3)"></feFlood>
      <feComposite in2="offsetblur" operator="in"></feComposite>
      <feMerge>
        <feMergeNode></feMergeNode>
        <feMergeNode in="SourceGraphic"></feMergeNode>
      </feMerge>
    </filter>
  </defs>
  <rect x="195.719" y="106.116" width="9.442" height="7.169" style="stroke-width: 0px; fill: rgb(255, 255, 255);"></rect>
  <path d="M 194.58 103.572 C 193.475 103.572 192.58 104.467 192.58 105.572 L 192.58 113.572 C 192.58 114.676 193.475 115.572 194.58 115.572 L 197.08 115.572 C 197.394 115.572 197.691 115.72 197.88 115.972 L 199.78 118.505 C 199.969 118.757 200.265 118.905 200.58 118.905 C 200.894 118.905 201.191 118.757 201.38 118.505 L 203.28 115.972 C 203.469 115.72 203.765 115.572 204.08 115.572 L 206.58 115.572 C 207.684 115.572 208.58 114.676 208.58 113.572 L 208.58 105.572 C 208.58 104.467 207.684 103.572 206.58 103.572 L 194.58 103.572 Z M 200.58 107.565 C 202.244 105.854 206.405 108.848 200.58 112.697 C 194.755 108.847 198.916 105.854 200.58 107.565" style="fill-rule: nonzero; fill: url(#gradient-0); filter: url(#drop-shadow-filter-1);"></path>
</svg>`;
        return new Style({
            image: new Icon({
                src: `data:image/svg+xml;base64,${btoa(svg)}`,
                scale,
            }),
        });
    }

    /**
     * Creates a VectorSource and VectorLayer styled with the given Style.
     * Returns both so the caller can hold independent refs to each.
     */
    static createVectorLayer(style: Style): { source: VectorSource; layer: VectorLayer<VectorSource> } {
        const source = new VectorSource();
        const layer = new VectorLayer({ source, style });
        return { source, layer };
    }

    /**
     * Initializes an OpenLayers Map attached to the provided HTML element.
     * Adds an OSM base tile layer and the given vector layer.
     * Call map.setTarget(undefined) in the useEffect cleanup.
     */
    static initMap(
        target: HTMLElement,
        vectorLayer: VectorLayer<VectorSource>,
        options: InitMapOptions = {},
    ): OLMap {
        const { center = [0, 0], zoom = 2 } = options;
        return new OLMap({
            target,
            layers: [
                new TileLayer({ source: new OSM() }),
                vectorLayer,
            ],
            view: new View({
                center: fromLonLat(center),
                zoom,
            }),
        });
    }

    /**
     * Creates an OL Feature for a journal entry. Sets the feature id to
     * entry.id and stores the entry object as the 'entry' property.
     */
    static createEntryFeature(entry: JournalEntry): Feature {
        const feature = new Feature({
            geometry: new Point(fromLonLat([entry.longitude, entry.latitude])),
            entry,
        });
        feature.setId(entry.id);
        return feature;
    }

    /**
     * Adds a single feature to the given VectorSource.
     */
    static addFeature(source: VectorSource, feature: Feature): void {
        source.addFeature(feature);
    }

    /**
     * Retrieves a feature from a VectorSource by its id.
     * Returns null if no matching feature is found.
     */
    static getFeatureById(source: VectorSource, id: string | number): Feature | null {
        const result = source.getFeatureById(id);
        if (!result || Array.isArray(result)) return null;
        return result as Feature;
    }

    /**
     * Animates the map view to center on the provided [lon, lat] coordinate.
     */
    static navigateToCoords(map: OLMap, lon: number, lat: number, options: AnimateOptions = {}, onComplete?: () => void): void {
        const { zoom = 14, duration = 800 } = options;
        if (onComplete) {
            map.getView().animate({ center: fromLonLat([lon, lat]), zoom, duration }, onComplete);
        } else {
            map.getView().animate({ center: fromLonLat([lon, lat]), zoom, duration });
        }
    }
}
