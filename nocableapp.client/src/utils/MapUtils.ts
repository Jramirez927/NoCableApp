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
    static animateTo(map: OLMap, lon: number, lat: number, options: AnimateOptions = {}): void {
        const { zoom = 14, duration = 800 } = options;
        map.getView().animate({
            center: fromLonLat([lon, lat]),
            zoom,
            duration,
        });
    }
}
