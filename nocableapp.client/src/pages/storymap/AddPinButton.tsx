import { GeoAltFill } from "react-bootstrap-icons";
import { MapUtils } from "../../utils/MapUtils";
import { useMap } from "../../contexts/MapProvider";
import { useEffect, useState } from "react";
import { Coordinate } from "ol/coordinate";
import Translate from "ol/interaction/Translate";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Point from "ol/geom/Point";

interface Props {
  selectedPlace: Coordinate | null;
  setSelectedPlace: React.Dispatch<React.SetStateAction<Coordinate | null>>;
  selectedPlaceLayer: VectorLayer<VectorSource>;
}
enum AddPinStatus {
  addingPin,
  clearingPin,
  inactive,
}

function AddPinButton({ selectedPlace, setSelectedPlace, selectedPlaceLayer }: Props) {
  const { map } = useMap();
  const [toolStatus, setToolStatus] = useState<AddPinStatus>(
    AddPinStatus.inactive,
  );
  const title =
    toolStatus == AddPinStatus.inactive
      ? "Click to Add Pin"
      : toolStatus == AddPinStatus.addingPin
        ? "Drop Pin"
        : "Remove Pin";

  useEffect(() => {
    // Sync status when pin is placed externally (e.g. via location search)
    if (selectedPlace && toolStatus === AddPinStatus.inactive) {
      setToolStatus(AddPinStatus.clearingPin);
      return;
    }
    // Reset status when pin is cleared externally (e.g. after journal entry created)
    if (!selectedPlace && toolStatus === AddPinStatus.clearingPin) {
      setToolStatus(AddPinStatus.inactive);
      return;
    }
    if (!map) return;

    // Click-to-place handler while in addingPin mode
    if (toolStatus === AddPinStatus.addingPin) {
      const handleMapClick = (e: { pixel: [number, number] }) => {
        const coord = map.getCoordinateFromPixel(e.pixel);
        setSelectedPlace(coord);
        setToolStatus(AddPinStatus.clearingPin);
        map.getTargetElement().style.cursor = "";
      };
      map.on("click", handleMapClick as never);
      return () => map.un("click", handleMapClick as never);
    }

    // Drag-to-reposition when pin is placed
    if (selectedPlace) {
      const translate = new Translate({ layers: [selectedPlaceLayer] });
      map.addInteraction(translate);

      const handleTranslateStart = () => {
        map.getTargetElement().style.cursor = "grabbing";
      };
      const handleTranslateEnd = () => {
        const feature = selectedPlaceLayer.getSource()?.getFeatures()[0];
        if (!feature) return;
        const coord = (feature.getGeometry() as Point).getCoordinates();
        map.getTargetElement().style.cursor = "grab";
        setSelectedPlace(coord);
      };
      const handlePointerMove = (e: any) => {
        if (map.getTargetElement().style.cursor === "grabbing") return;
        const hit = map.hasFeatureAtPixel(e.pixel, {
          layerFilter: (l) => l === selectedPlaceLayer,
        });
        map.getTargetElement().style.cursor = hit ? "grab" : "";
      };

      translate.on("translatestart", handleTranslateStart as never);
      translate.on("translateend", handleTranslateEnd as never);
      map.on("pointermove", handlePointerMove as never);

      return () => {
        map.removeInteraction(translate);
        map.un("pointermove", handlePointerMove as never);
        map.getTargetElement().style.cursor = "";
      };
    }
  }, [map, selectedPlace, selectedPlaceLayer, toolStatus]);
  const handlePinDropToggle = () => {
    // if place is set on map clear it

    switch (toolStatus) {
      case AddPinStatus.inactive:
        // set status to adding pin and update cursor
        setToolStatus(AddPinStatus.addingPin);
        map!.getTargetElement().style.cursor = `url('${MapUtils.pinSvgDataUrl("#2b09ee", 30)}') 15 30, crosshair`;
        break;
      case AddPinStatus.addingPin:
        // set to inactive and return to normal state
        setToolStatus(AddPinStatus.inactive);
        map!.getTargetElement().style.cursor = "";
        break;
      case AddPinStatus.clearingPin:
        setSelectedPlace(null);
        setToolStatus(AddPinStatus.inactive);
        map!.getTargetElement().style.cursor = "";
        break;
      default:
      // code block
    }
  };
  return (
    <button
      onClick={handlePinDropToggle}
      title={title}
      style={{
        padding: "8px 10px",
        ...(toolStatus !== AddPinStatus.inactive
          ? { background: "#0d6efd", color: "white" }
          : {}),
      }}
    >
      <GeoAltFill size={22} />
    </button>
  );
}

export default AddPinButton;
