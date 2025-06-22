import { useEffect } from 'react';

interface NativeAdvancedMarkerProps {
  map: google.maps.Map | null;
  position: google.maps.LatLngLiteral;
  title?: string;
  color: string;
  borderColor: string;
  scale: number;
  opacity: number;
  onClick: () => void;
}

export const NativeAdvancedMarker = (props: NativeAdvancedMarkerProps) => {
  const { map, onClick, ...options } = props;

  useEffect(() => {
    if (!map) return;

    const pinElement = new google.maps.marker.PinElement({
      background: options.color,
      borderColor: options.borderColor,
      glyphColor: '#FFFFFF',
      scale: options.scale,
    });

    const wrapper = document.createElement('div');
    wrapper.style.opacity = String(options.opacity);
    wrapper.appendChild(pinElement.element);

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: options.position,
      title: options.title,
      content: wrapper,
    });

    const clickListener = marker.addListener('click', onClick);

    return () => {
      google.maps.event.removeListener(clickListener);
      marker.map = null;
    };
  }, [map, options, onClick]);

  return null;
};