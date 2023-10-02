import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

import { AmmPool } from '../models/AmmPool';
import { comparePoolByTvl } from '../utils/comparePoolByTvl';
import { Dictionary } from '../utils/Dictionary';

export class AssetGraph {
  static fromPools(pools: AmmPool[]): AssetGraph {
    return pools.reduce((graph, pool) => graph.addPool(pool), new AssetGraph());
  }

  private pools: Map<string, AmmPool> = new Map();

  readonly vertices: Map<string, Set<string>> = new Map();

  addPool(pool: AmmPool): AssetGraph {
    this.addVertex(pool.x.asset);
    this.addVertex(pool.y.asset);
    this.addEdge(pool.x.asset, pool.y.asset);
    this.tryChangeAssetPool(pool);

    return this;
  }

  getPath(assetA: AssetInfo, assetB: AssetInfo): AmmPool[] {
    const { previous } = this.bfs(assetA);

    if (!previous[assetB.id]) {
      return [];
    }

    const path: AmmPool[] = [];
    let current = assetB.id;

    while (current !== assetA.id) {
      const pool = this.pools.get(
        this.getPairKey(current, previous[current]!),
      )!;

      path.unshift(pool);
      current = previous[current]!;
    }

    return path;
  }

  private addVertex(asset: AssetInfo): void {
    if (!this.vertices.has(asset.id)) {
      this.vertices.set(asset.id, new Set<string>());
    }
  }

  private addEdge(assetA: AssetInfo, assetB: AssetInfo): void {
    const setA = this.vertices.get(assetA.id)!;
    const setB = this.vertices.get(assetB.id)!;

    if (!setA.has(assetB.id)) {
      setA.add(assetB.id);
    }
    if (!setB.has(assetA.id)) {
      setB.add(assetA.id);
    }
  }

  private tryChangeAssetPool(pool: AmmPool): void {
    const pairKey = this.getPairKey(pool.x.asset.id, pool.y.asset.id);
    const currentPool = this.pools.get(pairKey);

    if (!currentPool) {
      this.pools.set(pairKey, pool);
    } else if (comparePoolByTvl(currentPool, pool) > 0) {
      this.pools.set(pairKey, pool);
    }
  }

  private getPairKey(assetAId: string, assetBId: string): string {
    return assetAId < assetBId
      ? `${assetAId}-${assetBId}`
      : `${assetBId}-${assetAId}`;
  }

  private bfs(asset: AssetInfo) {
    const queue = [asset.id];
    const visited = { [asset.id]: 1 };
    const distance = { [asset.id]: 0 };
    const previous: Dictionary<string | null> = {
      [asset.id]: null,
    };

    const handleVertex = (assetId: string): void => {
      const neighbours: string[] = Array.from(
        this.vertices.get(assetId)?.values() || [],
      );

      Array.from(neighbours.values()).forEach((n) => {
        if (!visited[n]) {
          visited[n] = 1;
          queue.push(n);
          previous[n] = assetId;
          distance[n] = distance[assetId] + 1;
        }
      });
    };

    while (queue.length) {
      const activeVertex = queue.shift()!;
      handleVertex(activeVertex);
    }

    return { distance, previous };
  }
}
