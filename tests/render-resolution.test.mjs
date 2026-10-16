import test from 'node:test';
import assert from 'node:assert/strict';
import {renderPixelRatio} from '../site/renderer.mjs';
test('Retina and 4K render buffers have bounded fill cost',()=>{
 const retina=renderPixelRatio(1920,1080,2);assert.ok(retina<2);assert.ok(1920*1080*retina**2<=4_000_001);
 const uhd=renderPixelRatio(3840,2160,1);assert.equal(uhd,.75);
 assert.equal(renderPixelRatio(1920,1080,1),1);assert.equal(renderPixelRatio(1280,720,2),2);
});
test('phone density and moving between desktop displays retain the intended limits',()=>{
 assert.equal(renderPixelRatio(390,844,3,true),1.2);assert.equal(renderPixelRatio(390,844,1,true),1);
 assert.ok(renderPixelRatio(1920,1080,2)>renderPixelRatio(3840,2160,2));
});
