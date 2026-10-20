import test from 'node:test';
import assert from 'node:assert/strict';
import { runBubbleSort } from './bubbleSort.ts';
import { runSelectionSort } from './selectionSort.ts';
import { runInsertionSort } from './insertionSort.ts';
import { runQuickSort } from './quickSort.ts';
import { runMergeSort } from './mergeSort.ts';

function isSorted(arr: number[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

test('Bubble Sort correctly sorts arbitrary, reversed, and duplicate arrays', () => {
  const inputs = [
    [64, 34, 25, 12, 22, 11, 90],
    [5, 4, 3, 2, 1],
    [10, 10, 20, 10, 5],
    [42],
    [1, 2, 3, 4, 5],
  ];

  for (const input of inputs) {
    const result = runBubbleSort(input);
    assert.equal(isSorted(result.finalArray), true, `Failed on ${JSON.stringify(input)}`);
    assert.equal(result.finalArray.length, input.length);
    assert.ok(result.steps.length > 0);
  }
});

test('Selection Sort correctly sorts arbitrary arrays and tracks stats', () => {
  const input = [29, 10, 14, 37, 13];
  const result = runSelectionSort(input);
  assert.equal(isSorted(result.finalArray), true);
  assert.ok(result.totalComparisons > 0);
  assert.ok(result.steps.length > 0);
});

test('Insertion Sort correctly sorts arbitrary arrays and tracks stats', () => {
  const input = [12, 11, 13, 5, 6];
  const result = runInsertionSort(input);
  assert.equal(isSorted(result.finalArray), true);
  assert.ok(result.steps.length > 0);
});

test('Quick Sort correctly partitions and sorts arrays', () => {
  const input = [10, 7, 8, 9, 1, 5];
  const result = runQuickSort(input);
  assert.equal(isSorted(result.finalArray), true);
  assert.equal(result.finalArray.length, input.length);
});

test('Merge Sort correctly divides and sorts arrays', () => {
  const input = [38, 27, 43, 3, 9, 82, 10];
  const result = runMergeSort(input);
  assert.equal(isSorted(result.finalArray), true);
  assert.equal(result.finalArray.length, input.length);
});
