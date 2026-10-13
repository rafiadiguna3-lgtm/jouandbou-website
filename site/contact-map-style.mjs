export function applyStudioContrast(map){
 for(const layer of map.getStyle().layers){
  const id=layer.id.toLowerCase(),paint=(key,value)=>map.setPaintProperty(layer.id,key,value);
  if(layer.type==='background')paint('background-color','#182638');
  if(layer.type==='fill'){
   if(/water/.test(id))paint('fill-color','#103c57');
   else if(/park|wood|forest|grass|green/.test(id))paint('fill-color','#28483b');
   else if(/building/.test(id)){paint('fill-color','#34495f');paint('fill-outline-color','#496177');}
   else if(/landuse|residential|commercial|industrial/.test(id))paint('fill-color','#203247');
  }
  if(layer.type==='line'&&/road|highway|street|motorway/.test(id)){
   paint('line-color',/casing|outline/.test(id)?'#182432':/motorway|trunk|primary/.test(id)?'#bac5d0':'#71869d');
   paint('line-opacity',1);
  }
  if(layer.type==='symbol'&&layer.layout?.['text-field']){paint('text-color','#d0d9e3');paint('text-halo-color','#172536');paint('text-halo-width',1.4);}
 }
}
